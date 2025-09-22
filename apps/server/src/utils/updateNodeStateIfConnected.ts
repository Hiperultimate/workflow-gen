import { clients } from "@/store";
import type { INode, NodeState } from "@/types/types";

function updateNodeStateIfConnected({
  workflowId,
  node,
  nodeState,
  message,
}: {
  workflowId: string;
  node: INode;
  nodeState: NodeState;
  message?: string;
}) {
  // Check if we have someone conected to workflowId clients
  // if yes then send them this update
  if (!clients.has(workflowId)) {
    return;
  }

  const newNodeState = {
    nodeId: node.id,
    nodeState: nodeState,
    message: message || null,
  };

  const sendUpdateResponse = clients.get(workflowId);
  sendUpdateResponse.write(`data: ${JSON.stringify(newNodeState)}\n\n`);
}

export default updateNodeStateIfConnected;
