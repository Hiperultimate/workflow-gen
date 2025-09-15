import { useState, useCallback, useEffect } from "react";
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
import { Dialog } from "@radix-ui/themes";
import AddNode from "./add-node";
import type { ICustomNode, NodeType } from "@/types";
import { v4 as uuid } from "uuid";
import type { IGetSingleWorkflow } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { saveWorkflow } from "@/api/saveWorkflow-put";
import { toast } from "sonner";
import AiAgent from "./nodes/AiAgent";

const nodeTypes = {
  telegramNode: TelegramNode,
  emailNode: EmailNode,
  webhookNode: WebhookNode,
  aiAgent : AiAgent
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  type: "custom-edge",
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  // console.log("drag event", node.data);
};

function Flow({ workflowData }: { workflowData: IGetSingleWorkflow }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const workflowTitle = workflowData.workflow.title;

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setEdges]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  fieldData: { ...(node.data.fieldData as any), ...data },
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    const initialNodesRaw = workflowData.workflow.nodes;
    const initialConnections = workflowData.workflow.connections;

    if (initialNodesRaw) {
      const initialNode = initialNodesRaw.map((item) => { 
        return { ...item , data : {...item.data, onDataUpdate : updateNodeData}}
      } )
      setNodes(initialNode);
    }
  
  setEdges(initialConnections);
  }, [workflowData]);

  const addNode = useCallback(
    (newNode: { type: NodeType }) => {
      const newId = uuid();
      const newPosition = {
        x: 10, // Consistent x-coordinate like initialNodes
        y: Math.max(...nodes.map((node) => node.position.y), 0) + 100, // Adding node after the bottom-most node
      };

      const nodeToAdd: Node = {
        id: newId,
        type: newNode.type,
        position: newPosition,
        data: { id: newId, fieldData: {}, onDataUpdate: updateNodeData },
      };

      setNodes((nds) => [...nds, nodeToAdd]);

      console.log("Node added! :", newNode);
    },
    [nodes, setNodes]
  );

  const saveWorkflowMutation = useMutation({
    mutationFn: saveWorkflow,
    onSuccess: () => {
      console.log("Workflow saved succesfully");
    },
  });

  function onSaveHandler() {
    toast.promise(
      saveWorkflowMutation.mutateAsync({
        id: workflowData.workflow.id,
        nodes: nodes as ICustomNode[],
        connections: edges,
        workflowDetails: {
          title: workflowTitle,
          enabled: workflowData.workflow.enabled,
        },
      }),
      {
        loading: "Saving workflow...",
        success: "Workflow saved successfully!",
        error: (err) => `Error: ${err.message}`,
      }
    );
  }

  return (
    <div className="grid grid-rows-[72px_1fr] w-full">
      <div className="bg-item w-full p-4 flex justify-between items-center">
        <div>{workflowTitle}</div>
        <button
          className="bg-pop px-4 py-2 hover:bg-pophover hover:cursor-pointer rounded-md"
          onClick={onSaveHandler}
        >
          Save
        </button>
      </div>
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
          <Dialog.Root>
            <Dialog.Trigger>
              <button className="bg-highlighted p-4 rounded-md border-2 hover:cursor-pointer hover:bg-white/30">
                <Plus />
              </button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>Node Selection</Dialog.Title>
              <Dialog.Description mb="4">
                Select a Node to add to your workflow
              </Dialog.Description>
              <AddNode onSelect={addNode} />
            </Dialog.Content>
          </Dialog.Root>
        </Panel>
        <Background bgColor="#302f31" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
