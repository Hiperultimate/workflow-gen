import { Send, SquarePen, Trash2 } from "lucide-react";
import { use, useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import SelectCredential from "../select-credential";
import type { ICredentials, NodeWithOptionalFieldData } from "@/types";
import useConnectedNodesData from "@/hooks/useConnectedNodesData";
import StateIcon from "../ui/state-icon";
import useNodeStates from "@/hooks/useNodeStates";

function TelegramNode({
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
  const { nodeState } = useNodeStates({ watchNodeId: data.id });
  
  const { deleteElements } = useReactFlow();
  const { fieldData } = data;
  const { getSourceNodesData } = useConnectedNodesData();

  const selectedCred = useRef<ICredentials | null>(
    fieldData?.selectedCred || null
  );
  const parentNodeData = getSourceNodesData(id) as NodeWithOptionalFieldData[];
  const chatId = useRef(fieldData?.chatId || "");
  const chatMessage = useRef(fieldData?.chatMessage || "");

  const [selectedCredential, setSelectedCredential] =
    useState<ICredentials | null>(selectedCred.current);
   const [chatIdInput, setChatIdInput] = useState(chatId.current);
   const [chatMessageInput, setChatMessageInput] = useState(chatMessage.current);

  const editTelegramNodeHandler = useCallback(() => {
    chatId.current = chatIdInput;
    selectedCred.current = selectedCredential;
    chatMessage.current = chatMessageInput;
    data.onDataUpdate(id, {
      selectedCred: selectedCred.current,
      chatId: chatId.current,
      chatMessage: chatMessage.current,
    });
  }, [chatIdInput, selectedCredential, chatMessageInput, data.onDataUpdate]);

  const deleteTelegramNodeHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  const onSelectedCredentialChange = useCallback(
    (credential: ICredentials | null) => {
      setSelectedCredential(credential);
    },
    []
  );

  // Populate reactflow node object containing data with empty fields
  useEffect(() => {
    editTelegramNodeHandler();
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
          <Dialog.Title>Edit Telegram Node</Dialog.Title>
          <Dialog.Description mb="4">
            Enter the Chat ID for the Telegram Bot
          </Dialog.Description>

          <div className="bg-gray-800 border border-gray-300 rounded-md px-4 py-2 text-gray-300 font-mono">
            <div className="mb-1 font-bold">Input Data Preview</div>
            {parentNodeData && (
              <div>
                {parentNodeData
                  .map((node) => node.fieldData?.header ?? []) // safe: if fieldData or header missing, use empty array
                  .flat()
                  .map((headerValue, idx) => (
                    <span key={idx}>{`{{${headerValue}}} `}</span>
                  ))}
              </div>
            )}
          </div>

          <Flex direction="column" gap="3">
            <label>
              <SelectCredential
                selectedCredential={selectedCredential}
                onSelect={onSelectedCredentialChange}
              />
            </label>

            <label>
              <div className="mb-1 font-bold">Chat ID</div>
              <TextField.Root
                placeholder="Enter Chat ID"
                value={chatIdInput}
                onChange={(e) => {
                  setChatIdInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">Message</div>
              <TextArea
                placeholder="Enter HTML content here"
                value={chatMessageInput}
                onChange={(e) => {
                  setChatMessageInput(e.target.value);
                }}
                className="w-full p-2 border rounded-md bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                onClick={() => editTelegramNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Send size={28} />
        <div className="font-bold text-md">Telegram Bot</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>

       <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
         <Trash2
           size={15}
           color="#f96d5c"
           onClick={() => deleteTelegramNodeHandler(id)}
         />
       </div>
       <div className="absolute top-1 right-1 bg-highlighted rounded p-0.5">
         <StateIcon state={nodeState} />
       </div>
     </NodeWrapper>
  );
}

export default TelegramNode;
