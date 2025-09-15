import { Bot, Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import {
  Handle,
  Position,
  useConnection,
  useReactFlow,
  type ConnectionState,
} from "@xyflow/react";
import { Dialog, Flex, TextField } from "@radix-ui/themes";
import { ButtonHandle } from "../button-handle";
import { Button } from "../ui/button";

const selector = (connection: ConnectionState) => {
  return connection.inProgress;
};

function AiAgent({
  id,
  data,
}: {
  id: string;
  data: {
    id: string;
    fieldData: any;
    onDataUpdate: (id: string, data: any) => void;
  };
}) {
  const connectionInProgress = useConnection(selector);
  const { deleteElements } = useReactFlow();
  const { fieldData } = data;
  const prompt = useRef(fieldData?.prompt || "");

  const [promptRef, setPromptRef] = useState(prompt.current);

  const editAiAgentNodeHandler = useCallback(() => {
    prompt.current = promptRef;
    data.onDataUpdate(id, {
      prompt: prompt.current,
    });
  }, [promptRef, data.onDataUpdate]);

  const deleteAiAgentNodeHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  // Populate reactflow node object containing data with empty fields
  useEffect(() => {
    editAiAgentNodeHandler();
  }, []);

  return (
    <NodeWrapper>
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
            <SquarePen size={15} />
          </div>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Edit AI Agent Node</Dialog.Title>
          <Dialog.Description mb="4">
            Enter the AI Prompt for the AI Agent
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <div className="mb-1 font-bold">AI Prompt</div>
              <TextField.Root
                placeholder="Enter AI Prompt"
                value={promptRef}
                onChange={(e) => {
                  setPromptRef(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <button className="bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 hover:cursor-pointer">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close>
              <button
                className="bg-pop px-4 py-2 rounded-md hover:bg-pophover hover:cursor-pointer"
                onClick={() => editAiAgentNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Bot size={28} />
        <div className="font-bold text-md">AI Agent</div>
        <Handle type="target" position={Position.Top} id="top" />
        <Handle type="source" position={Position.Bottom} id="bottom" />

        <ButtonHandle
          type="target"
          position={Position.Left}
          id="chat-model"
          style={{ top: "30%" }}
          showButton={!connectionInProgress}
        >
          <Button
            onClick={() => console.log("Clicked")}
            size="sm"
            variant="secondary"
            className="bg-highlighted rounded-full text-xs py-0 px-2 h-5"
          >
            <div>Chat Model</div>
            <Plus size={8} />
          </Button>
        </ButtonHandle>

        <ButtonHandle
          type="target"
          position={Position.Left}
          id="tool"
          style={{ top: "70%" }}
          showButton={!connectionInProgress}
        >
          <Button
            onClick={() => console.log("Clicked")}
            size="sm"
            variant="secondary"
            className="bg-highlighted rounded-full text-xs py-0 px-2 h-5"
          >
            <div>Tool</div>
            <Plus size={8} />
          </Button>
        </ButtonHandle>
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteAiAgentNodeHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default AiAgent;
