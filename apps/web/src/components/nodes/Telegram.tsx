import { Send, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position } from "@xyflow/react";
import { Dialog, Flex, TextField } from "@radix-ui/themes";
import SelectCredential from "../select-credential";

function TelegramNode() {
  const chatId = useRef("");

  const [chatIdRef, setChatIdRef] = useState(chatId.current);

  const editTelegramNodeHandler = useCallback(() => {
    chatId.current = chatIdRef;
    console.log("Edit node with ChatID:", chatIdRef);
  }, []);

  const deleteTelegramNodeHandler = useCallback(() => {
    console.log("Delete node");
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

          <Flex direction="column" gap="3">
            <label>
              <SelectCredential
                onSelect={() => {
                  console.log("Callback");
                }}
              />
            </label>

            <label>
              <div className="mb-1 font-bold">Chat ID</div>
              <TextField.Root
                placeholder="Enter Chat ID"
                value={chatIdRef}
                onChange={(e) => {
                  setChatIdRef(e.target.value);
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
          onClick={() => deleteTelegramNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default TelegramNode;
