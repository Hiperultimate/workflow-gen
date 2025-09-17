import { SquarePen, Trash2, Webhook } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { v4 as uuid } from "uuid";

function WebhookNode({
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
  const { deleteElements } = useReactFlow();

  const { fieldData } = data;

  const path = useRef(fieldData?.path || "");
  const method = useRef(fieldData?.method || "GET");
  const title = useRef(fieldData?.title || "");
  const header = useRef(fieldData?.header || "");
  const secret = useRef(fieldData?.secret || "");

  const [pathInput, setPathInput] = useState(path.current);
  const [methodInput, setMethodInput] = useState(method.current);
  const [titleInput, setTitleInput] = useState(title.current);
  const [headerInput, setHeaderInput] = useState(header.current);
  const [secretInput, setSecretInput] = useState(secret.current);

  const editWebhookNodeHandler = useCallback(() => {
    let checkedUrl = pathInput; 
    if (checkedUrl.trim().length === 0) {
      const newUrl = generatepath();
      setPathInput(newUrl);
      checkedUrl = newUrl;
    }
    path.current = checkedUrl;
    method.current = methodInput;
    title.current = titleInput;
    header.current = headerInput;
    secret.current = secretInput;
    data.onDataUpdate(id, {
      id: id,
      path: checkedUrl,
      method: methodInput,
      title: titleInput,
      header: headerInput,
      secret: secretInput,
    });
  }, [pathInput, methodInput, titleInput, headerInput, secretInput]);

  const deleteWebhookNodeHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  const generatepath = useCallback(() => {
    const newUuid = uuid();
    const resultUrl = `${newUuid}`;
    path.current = resultUrl;
    return resultUrl;
  }, []);

  if (path.current.trim().length === 0) {
    const newUrl = generatepath();
    setPathInput(newUrl);
  }
  

  // Populate reactflow node object containing data with empty fields
  useEffect(() => {
    editWebhookNodeHandler();
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
                  setMethodInput(value);
                }}
                defaultValue={methodInput}
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
              <div className="mb-1 font-bold">Path</div>
              <TextField.Root
                placeholder="Enter Webhook Path"
                value={pathInput}
                onChange={(e) => {
                  setPathInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
              <div className="mt-2">
                <div className="bg-gray-800 border border-gray-300 rounded-md px-4 py-2 text-gray-300 font-mono">
                <div className="mb-1 font-bold">URL Preview</div>
                  {`webhook/${pathInput}`}
                </div>
              </div>
            </label>

            <label>
              <div className="mb-1 font-bold">Title</div>
              <TextField.Root
                placeholder="Invoking workflows"
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">URL Headers</div>
              <TextField.Root
                placeholder={`{"header1" : "headerValue"}`}
                value={headerInput}
                onChange={(e) => {
                  setHeaderInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">Secret</div>
              <TextField.Root
                placeholder="unique password"
                value={secretInput}
                onChange={(e) => {
                  setSecretInput(e.target.value);
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
          onClick={() => deleteWebhookNodeHandler(id)}
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
