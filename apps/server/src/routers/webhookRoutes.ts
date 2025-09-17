import type { IConnection, INode } from "@/types/types";
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

// function processNode(idOfNodeToProcess, inputData) {}

export default webhookRoutes;
