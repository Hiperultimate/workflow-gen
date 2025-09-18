import { getIncomers, useReactFlow } from "@xyflow/react";

function useConnectedNodesData() {
  const { getNodes, getNode, getEdges, getNodeConnections } = useReactFlow();

  const getConnectedNodes = (nodeId: string) => {
    const conns = getNodeConnections({ nodeId }); // NodeConnection[]
    const otherIds = Array.from(
      new Set(
        conns
          .map((c) => (c.source === nodeId ? c.target : c.source))
          .filter(Boolean)
      )
    );
    const nodes = otherIds
      .map((id) => getNode(id))
      .filter((n): n is NonNullable<typeof n> => !!n);

    return nodes; // Node[] (full node objects)
  };

  const getConnectedNodesData = (nodeId: string) =>
    getConnectedNodes(nodeId).map((n) => n.data);

  const getSourceNodesOfTarget = (nodeId : string) => {
    const nodes = getNodes();
    const edges = getEdges();
    
    const node = getNode(nodeId);
    if (!node) {
      return [];
    }

    const incoming = getIncomers(node, nodes, edges);
    return incoming; // NodeType[]
  };

  const getSourceNodesData = (nodeId : string) => {
    return getSourceNodesOfTarget(nodeId).map(n => n.data);
  };

  return {
    getConnectedNodes,
    getConnectedNodesData,
    getSourceNodesData
  };
}

export default useConnectedNodesData;
