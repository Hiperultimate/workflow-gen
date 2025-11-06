import {
  NodeStates,
  NodeTypes,
  type IConnection,
  type INode,
} from "@/types/types";
import updateNodeStateIfConnected from "../updateNodeStateIfConnected";
import sendTelegramMessage from "@/services/sendTelegramMessage";
import executeWebhook from "./webhook";
import executeEmail from "./email";
import executeTelegram from "./telegram";
import executeSolana from "./solana";

export async function processNode(
  // nodeId: string,
  node: INode,
  inputData: Record<any, any>,
  workflowId: string
): Promise<{ success: boolean; passingData: any; message?: string }> {
  const nodeType = node.type;
  switch (nodeType) {
    case NodeTypes.Webhook: {
      console.log("Processing Webhook : ", nodeType);

      const webhookData = executeWebhook(node, workflowId, inputData.header);

      return { success: true, passingData: webhookData };
    }
    case NodeTypes.Email: {
      console.log("Processing Email : ", nodeType);

      updateNodeStateIfConnected({
        workflowId: workflowId,
        node: node,
        nodeState: NodeStates.Loading,
      });

      const emailFieldData = node.data?.fieldData;
      const subjectRaw = emailFieldData.subject;
      const toEmailRaw = emailFieldData.toEmail;
      const htmlMailRaw = emailFieldData.htmlMail;
      const emailCredentials = emailFieldData?.selectedCred;
      const headerData = inputData?.passingData?.header;

      console.log("Process node : ", {toEmailRaw, subjectRaw, htmlMailRaw, emailCredentials});

      const nodeOutput = await executeEmail(
        {
          emailFieldData,
          subjectRaw,
          toEmailRaw,
          htmlMailRaw,
          emailCredentials,
          headerData,
        },
        workflowId,
        node
      );

      if(nodeOutput) return nodeOutput;

      return { success: true, passingData: {} };
    }
    case NodeTypes.Telegram: {
      console.log("Processing Telegram");

      updateNodeStateIfConnected({
        workflowId,
        node,
        nodeState: NodeStates.Loading,
      });

      const fieldData = node.data?.fieldData;
      const headerData = inputData?.passingData?.header;

      const nodeOutput = await executeTelegram(
        { fieldData, headerData },
        workflowId,
        node
      );

      return nodeOutput;
    }
    case NodeTypes.SolanaSendTokenNode: {
      console.log("Processing Solana Send Token Node");

      const fieldData = node.data?.fieldData;

      const nodeOutput = await executeSolana(
        { fieldData },
        workflowId,
        node
      );

      return nodeOutput;
    }
    default:
      console.log("Unable to find Node Type : ", nodeType);
      return { success: false, passingData: {} };
  }
}

export function getWebhookPassingData(
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

// Funtion to replace {{text}} with value inside header
type Header = Record<string, string>;
export function interpolate(template: string, header: Header): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return header[trimmedKey] ?? ""; // fallback if key not found
  });
}

export function getSourcesOfNode(
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

export function getConnectedNodesFromNode(
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
