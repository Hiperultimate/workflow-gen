import { Brain, CodeXml, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Dialog, Flex, TextField, Select, TextArea } from "@radix-ui/themes";

function CodeToolNode({
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
  const description = useRef(fieldData?.description || "");
  const language = useRef(fieldData?.language || "Javascript");
  const code = useRef(fieldData?.code || "");

  const [descriptionRef, setDescriptionRef] = useState(description.current);
  const [languageRef, setLanguageRef] = useState(language.current);
  const [codeRef, setCodeRef] = useState(code.current);

  const editCodeToolNodeHandler = useCallback(() => {
    description.current = descriptionRef;
    language.current = languageRef;
    code.current = codeRef;
    data.onDataUpdate(id, {
      description: description.current,
      language: language.current,
      code: code.current,
    });
  }, [descriptionRef, languageRef, codeRef, data.onDataUpdate]);

  const deleteCodeToolNodeHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  // Populate reactflow node object containing data with empty fields
  useEffect(() => {
    editCodeToolNodeHandler();
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
          <Dialog.Title>Edit Code Tool Node</Dialog.Title>
          <Dialog.Description mb="4">
            Configure the Code Tool Node
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <div className="mb-1 font-bold">Description</div>
              <TextArea
              placeholder="Enter description of what the code will do"
                value={descriptionRef}
                onChange={(e) => setDescriptionRef(e.target.value)}
              />
            </label>
            <label>
              <div className="mb-1 font-bold">Language</div>
              <Select.Root
                size="2"
                value={languageRef}
                onValueChange={setLanguageRef}
                defaultValue="Javascript"
              >
                <Select.Trigger placeholder="Select language" />
                <Select.Content>
                  <Select.Item value="Javascript">Javascript</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
            <label>
              <div className="mb-1 font-bold">Code</div>
              <TextArea
                placeholder="Enter your Javascript code"
                value={codeRef}
                onChange={(e) => setCodeRef(e.target.value)}
                className="h-24"
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
                onClick={() => editCodeToolNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <CodeXml size={28} />
        <div className="font-bold text-md">Code Tool Node</div>
        <Handle type="source" position={Position.Bottom} id="output" />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteCodeToolNodeHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default CodeToolNode;
