import { NodeTypes, type IConnection, type INode } from "@/types/types";
import { prisma, type Methods } from "@workflow-gen/db";
import { Router } from "express";

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

  const connectedNodes = getConnectedNodesFromNode(
    webhookId,
    nodes,
    connections
  );

  console.log("Nodes connected to webhook : ", connectedNodes);

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

function processNodeById(nodeId: string, node: INode, inputData: Record<any, any>) {
  const nodeType = node.type;
  switch (nodeType) {
    case NodeTypes.Email: {
      console.log("Processing Email");
      // const emailFieldData = node.data.fieldData;
      // const subject = emailFieldData.subject;
      // const toEmail = emailFieldData.toEmail;
      // const htmlMail = emailFieldData.htmlMail;
      // const fromEmail = emailFieldData.fromEmail;
      // const emailCredentials = emailFieldData.selectedCred.data.key;

      break;
    };
    case NodeTypes.Telegram: {
      console.log("Processing Telegram");
      break;
    }
  }
  // get node
  // get node type eg telegram / email
  // run code according to node type by using switch case (very simple)
}

export default webhookRoutes;
