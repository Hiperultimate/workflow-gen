import { SquarePen, Trash2, Webhook } from "lucide-react";
import { useCallback, useRef } from "react";
import NodeWrapper from "./NodeWrapper";
import { Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import { Handle, Position } from "@xyflow/react";
import { useParams } from "@tanstack/react-router";
import { v4 as uuid } from 'uuid';

function WebhookNode() {
  const { id } = useParams({ strict: false });
  const methodRefInput = useRef("");
  const webhookUrlInput = useRef("");

  const webhookUrl = useRef("");
  const method = useRef("GET");

  const editWebhookNodeHandler = useCallback(() => {
    webhookUrl.current = webhookUrlInput.current;
    method.current = methodRefInput.current;
    console.log("Edit node");
  }, []);

  const deleteWebhookNodeHandler = useCallback(() => {
    console.log("Delete node");
  }, []);

  const generateWebhookUrl = useCallback(() => { 
    if (webhookUrl.current.trim().length > 0) return;
    const newUuid = uuid(); 
    webhookUrl.current = `webhook/${id}/${newUuid}`;
  }, [])

  generateWebhookUrl();

  return (
    <NodeWrapper>
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
            <SquarePen size={15} />
          </div>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Edit Webhook Node</Dialog.Title>
          <Dialog.Description mb="4">
            Enter details for Webhook
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <div className="mb-1 font-bold">HTTP Method</div>
              <Select.Root
                size="2"
                onValueChange={(value) => {
                  methodRefInput.current = value;
                }}
                defaultValue={method.current}
              >
                <Select.Trigger placeholder="Select HTTP method..." />
                <Select.Content position="popper" side="bottom">
                  <Select.Group>
                    <Select.Label>Webhook HTTP Method</Select.Label>
                    {httpMethods.map((method) => (
                      <Select.Item key={method} value={method}>
                        {method}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">Webhook URL</div>
              <TextField.Root
                placeholder="Enter Webhook URL"
                value={webhookUrl.current}
                onChange={(e) => {
                  webhookUrlInput.current = e.target.value;
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
                onClick={() => editWebhookNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Webhook size={28} />
        <div className="font-bold text-md">Webhook</div>
        {/* <div>{item.title}</div> */}
        <Handle type="source" position={Position.Bottom} />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteWebhookNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default WebhookNode;


const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
];
