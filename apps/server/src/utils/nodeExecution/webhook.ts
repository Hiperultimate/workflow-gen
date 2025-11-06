import { NodeStates, type INode } from "@/types/types";
import updateNodeStateIfConnected from "../updateNodeStateIfConnected";
import { getWebhookPassingData } from "./main";

function executeWebhook(node: INode, workflowId: string, headerData: string[]) {
  updateNodeStateIfConnected({
    workflowId: workflowId,
    node: node,
    nodeState: NodeStates.Loading,
  });

  const webhookData = getWebhookPassingData(node, headerData);

  updateNodeStateIfConnected({
    workflowId: workflowId,
    node: node,
    nodeState: NodeStates.Completed,
  });

  return webhookData;
}

export default executeWebhook;
