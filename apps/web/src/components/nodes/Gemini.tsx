import { Brain, Send, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Dialog, Flex } from "@radix-ui/themes";
import SelectCredential from "../select-credential";
import type { ICredentials } from "@/types";

function GeminiNode({
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
  const selectedCred = useRef<ICredentials | null>(
    fieldData?.selectedCred || null
  );

  const [selectedCredential, setSelectedCredential] =
    useState<ICredentials | null>(selectedCred.current);

  const editGeminiNodeHandler = useCallback(() => {
    selectedCred.current = selectedCredential;
    data.onDataUpdate(id, {
      selectedCredential: selectedCred.current,
    });
  }, [selectedCredential, data.onDataUpdate]);

  const deleteGeminiNodeHandler = useCallback(
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
    editGeminiNodeHandler();
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
          <Dialog.Title>Edit Gemini Node</Dialog.Title>
          <Dialog.Description mb="4">
            Select a credential for the Gemini Node
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <SelectCredential
                selectedCredential={selectedCredential}
                onSelect={onSelectedCredentialChange}
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
                onClick={() => editGeminiNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Brain size={28} />
        <div className="font-bold text-md">Gemini Node</div>
        <Handle type="source" position={Position.Bottom} id="output" />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteGeminiNodeHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default GeminiNode;
