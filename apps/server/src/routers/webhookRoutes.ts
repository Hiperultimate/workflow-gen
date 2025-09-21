import { NodeTypes, type IConnection, type INode } from "@/types/types";
import { prisma, type Methods } from "@workflow-gen/db";
import { Router } from "express";
import sendTelegramMessage from "@/services/sendTelegramMessage";
import { sendMail } from "@/services/sendMail";

const webhookRoutes = Router();

webhookRoutes.all("/:path", async (req, res) => {
  const { path: webhookPath } = req.params;
  const method = req.method as Methods;

  // Log the request method and ID
  console.log(`Received ${method} request for /webhook/${webhookPath}`);

  const webhookRecord = await prisma.webhook.findFirst({
    where: { path: webhookPath, method: method },
    include: { workflow: true },
  });

  if (!webhookRecord) {
    return res
      .status(400)
      .send({ message: "Invalid webhook path. Workflow not found." });
  }

  const workflowData = webhookRecord.workflow;

  const webhookId = webhookRecord.id;
  const nodes = workflowData.nodes as INode[];
  const connections = workflowData.connections as IConnection[];

  const processNodeArr: { node: INode; passingData: any }[] = [];
  const firstNode = nodes.filter((node) => node.id === webhookId)[0];
  const passingData = getWebhookPassingData(
    firstNode,
    Object.keys(req.body).length > 0 ? req.body : req.query
  );

  processNodeArr.push({ node: firstNode, passingData: passingData });
  let iter = 0;
  while (iter < processNodeArr.length) {
    const { node: currentNode, passingData: currentNodePassingData } =
      processNodeArr[iter];

    const passingData = await processNode(currentNode, currentNodePassingData); // Write code here to return processed data
    const nextNodes = getConnectedNodesFromNode(
      currentNode.id,
      nodes,
      connections
    );

    nextNodes.forEach((node) => {
      processNodeArr.push({ node: node, passingData: passingData });
    });
    iter++;
  }

  res.status(200).send({ message: "Recieved webhook request, initiating..." });
});

function getConnectedNodesFromNode(
  nodeId: string,
  nodes: INode[],
  connections: IConnection[]
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const connectedNodes = connections
    .filter((connection) => connection.source === nodeId)
    .map((connection) => nodeMap.get(connection.target))
    .filter((node): node is INode => node !== undefined);

  return connectedNodes;
}

function getWebhookPassingData(
  webhookNode: INode,
  reqObj: Record<string, any>
) {
  const nodeData = webhookNode.data;
  const headerData: string[] = nodeData?.fieldData?.header;
  if (!headerData) return [];

  const reqData: Record<string, string> = {};

  headerData.forEach((keyword) => {
    reqData[keyword] = reqObj[keyword];
  });

  return { header: reqData };
}

function getSourcesOfNode(
  nodeId: string,
  nodes: INode[],
  connections: IConnection[]
) {
  const connectionOfNodesConnectedToNodeId = connections.filter(
    (connection) => {
      return connection.target === nodeId;
    }
  );
  const nodesConnectedToNodeId = connectionOfNodesConnectedToNodeId.flatMap(
    (connection) => {
      const node = nodes.find((node) => node.id === connection.source);
      return node ? [node] : [];
    }
  );

  return nodesConnectedToNodeId;
}

async function processNode(
  // nodeId: string,
  node: INode,
  inputData: Record<any, any>
): Promise<{ success: boolean; passingData: any; message?: string }> {
  const nodeType = node.type;
  switch (nodeType) {
    case NodeTypes.Webhook: {
      console.log("Processing Webhook : ", nodeType);

      const webhookData = getWebhookPassingData(node, inputData.header);
      return { success: true, passingData: webhookData };
    }
    case NodeTypes.Email: {
      console.log("Processing Email : ", nodeType);

      const emailFieldData = node.data?.fieldData;
      const subjectRaw = emailFieldData.subject;
      const toEmailRaw = emailFieldData.toEmail;
      const htmlMailRaw = emailFieldData.htmlMail;
      const emailCredentials = emailFieldData?.selectedCred;
      const headerData = inputData?.passingData?.header;

      const subject = interpolate(subjectRaw || "", headerData);
      const toEmail = interpolate(toEmailRaw || "", headerData);
      const htmlMail = interpolate(htmlMailRaw || "", headerData);
      const fromEmail = emailCredentials?.data?.email;
      const resendApiKey = emailCredentials?.data?.api;

      // console.log("Checking email data :", {
      //   subject: subject,
      //   toEmail: toEmail,
      //   htmlMail: htmlMail,
      //   emailCredentials: emailCredentials,
      //   headerData: headerData,
      //   fromEmail: fromEmail,
      //   resendApiKey: resendApiKey,
      // });

      if (!emailCredentials || !resendApiKey || !fromEmail) {
        return {
          success: false,
          passingData: {},
          message: "No credentials found",
        };
      }

      const { success, message: mailMessage } = await sendMail({
        // from: fromEmail, // Currently using default email because of resend restrictions
        to: toEmail,
        subject: subject,
        htmlMail: htmlMail,
        resendApi: resendApiKey,
      });
      console.log("Checking send mail response : ", success, mailMessage);
      if (success === false)
        return { success: false, passingData: {}, message: mailMessage };

      return { success: true, passingData: {} };
    }
    case NodeTypes.Telegram: {
      console.log("Processing Telegram");

      const fieldData = node.data?.fieldData;
      const chatIdForm = fieldData.chatId;
      const chatMessageForm = fieldData.chatMessage;
      const telegramCredentials = fieldData.selectedCred;

      const headerData = inputData?.passingData?.header;
      const finalChatId = interpolate(chatIdForm || "", headerData);
      const finalChatMessage = interpolate(chatMessageForm || "", headerData);

      const telegramBotApi = telegramCredentials?.data?.botApi;
      const response = await sendTelegramMessage({chatId: finalChatId, message: finalChatMessage, telegramApi: telegramBotApi || ''});

      return { success: response.success, passingData: {} };
    }
    default:
      console.log("Unable to find Node Type : ", nodeType);
      return { success: false, passingData: {} };
  }
}

// Funtion to replace {{text}} with value inside header
type Header = Record<string, string>;
function interpolate(template: string, header: Header): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return header[trimmedKey] ?? ""; // fallback if key not found
  });
}

export default webhookRoutes;
