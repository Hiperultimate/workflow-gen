import { getIncomers, useReactFlow } from "@xyflow/react";

type FieldData = Record<string, any> & {
  previousNodesData?: Record<string, any>;
};

type NodeData = {
  fieldData?: FieldData;
};

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

  const getSourceNodesOfTarget = (nodeId: string) => {
    const nodes = getNodes();
    const edges = getEdges();

    const node = getNode(nodeId);
    if (!node) {
      return [];
    }

    const incoming = getIncomers(node, nodes, edges);
    return incoming; // NodeType[]
  };

  const getSourceNodesData = (nodeId: string) => {
    return getSourceNodesOfTarget(nodeId).map((n) => n.data);
  };

  const getPreviousNodesData = (nodeId: string) => {
    // Currently we are expecting a single node will be connected to only one node
    const previousNodesDataArr: NodeData[] = getSourceNodesData(nodeId);

    const availableKeyMap = new Set<string>();

    previousNodesDataArr.forEach((nodeData) => {
      const { previousNodesData, ...rest } = (nodeData?.fieldData ||
        {}) as FieldData;

      // Add top-level keys
      Object.keys(rest).forEach((key) => availableKeyMap.add(key));

      // If previousNodesData exists, add its keys too
      if (previousNodesData && typeof previousNodesData === "object") {
        Object.keys(previousNodesData).forEach((key) =>
          availableKeyMap.add(key)
        );
      }
    });

    const previousNodesData = previousNodesDataArr
      .map((node) => {
        const { previousNodesData, ...rest } = (node.fieldData ||
          {}) as FieldData;

        // Flatten previousNodesData into rest if it exists
        if (previousNodesData && typeof previousNodesData === "object") {
          return { ...rest, ...previousNodesData };
        }

        return rest;
      })
      .flat() as Record<string, any>[];

    let nodeFlatData: Record<string, any> = {};
    previousNodesData.forEach((data) => {
      nodeFlatData = { ...nodeFlatData, ...data };
    });

    const excludeKeys = ["id", "runtimeData", "selectedCred"];
    excludeKeys.forEach((key) => {
      availableKeyMap.delete(key);
      delete nodeFlatData[key];
    });

    // console.log("available keys :", availableKeyMap);
    // console.log("checking nodeFlatData : ", nodeFlatData);

    return {
      nodeData: nodeFlatData,
      nodeDataKeys: Array.from(availableKeyMap),
    };
  };

  return {
    getConnectedNodes,
    getConnectedNodesData,
    getSourceNodesData,
    getPreviousNodesData,
  };
}

export default useConnectedNodesData;
