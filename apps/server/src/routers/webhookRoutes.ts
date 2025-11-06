import {
  NodeStates,
  type IConnection,
  type INode,
} from "@/types/types";
import { prisma, type Methods } from "@workflow-gen/db";
import { Router } from "express";
import updateNodeStateIfConnected from "@/utils/updateNodeStateIfConnected";
import { getConnectedNodesFromNode, getWebhookPassingData, processNode } from "@/utils/nodeExecution/main";

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
    Object.keys(req.body || {}).length > 0 ? req.body : req.query
  );

  processNodeArr.push({ node: firstNode, passingData: passingData });

  updateNodeStateIfConnected({
    workflowId: workflowData.id,
    node: firstNode,
    nodeState: NodeStates.InProgress,
  });

  let iter = 0;
  while (iter < processNodeArr.length) {
    const { node: currentNode, passingData: currentNodePassingData } =
      processNodeArr[iter];

    const passingData = await processNode(
      currentNode,
      currentNodePassingData,
      workflowData.id
    ); // Write code here to return processed data
    const nextNodes = getConnectedNodesFromNode(
      currentNode.id,
      nodes,
      connections
    );

    nextNodes.forEach((node) => {
      processNodeArr.push({ node: node, passingData: passingData });

      // Changing live states to InProgress if required
      updateNodeStateIfConnected({
        workflowId: workflowData.id,
        node: node,
        nodeState: NodeStates.InProgress,
      });
    });
    iter++;
  }

  res.status(200).send({ message: "Recieved webhook request, initiating..." });
});

export default webhookRoutes;
