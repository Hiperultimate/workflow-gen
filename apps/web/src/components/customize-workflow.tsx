import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  Controls,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import TelegramNode from "./nodes/Telegram";
import CustomEdge from "./edges/edge";
import EmailNode from "./nodes/Email";
import WebhookNode from "./nodes/Webhook";

const nodeTypes = {
  telegramNode: TelegramNode,
  emailNode: EmailNode,
  webhookNode: WebhookNode,
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

const initialNodes: Node[] = [
  { id: "1", data: { label: "Node 1" }, position: { x: 5, y: 5 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
  {
    id: "3",
    type: "telegramNode",
    position: { x: 10, y: 200 },
    data: { value: 123 },
  },
  {
    id: "4",
    type: "emailNode",
    position: { x: 10, y: 300 },
    data: { value: 123 },
  },
  {
    id: "5",
    type: "webhookNode",
    position: { x: 10, y: 400 },
    data: { value: 123 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "custom-edge" },
];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      colorMode="dark"
    >
      <Panel position="top-left">
        {/* Add logic to select form which user can type and get the required node they want to make on pressing this button */}
        <button className="bg-highlighted p-4 rounded-md border-2 hover:cursor-pointer hover:bg-white/30">
          <Plus />
        </button>
      </Panel>
      <Background bgColor="#302f31" variant={BackgroundVariant.Dots} />
      <Controls />
    </ReactFlow>
  );
}

export default Flow;
