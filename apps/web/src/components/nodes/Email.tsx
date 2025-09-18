import { Mail, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import SelectCredential from "../select-credential";
import type { ICredentials } from "@/types";
import useConnectedNodesData from "@/hooks/useConnectedNodesData";

type NodeWithOptionalFieldData = {
  fieldData?: {
    header?: string[];
  };
};

function EmailNode({
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
  const { deleteElements, getNodes } = useReactFlow();
  const { getSourceNodesData } = useConnectedNodesData();
  const { fieldData } = data;

  const parentNodeData = getSourceNodesData(id) as NodeWithOptionalFieldData[];
  // New saved state
  const selectedCred = useRef<ICredentials | null>(
    data?.fieldData?.selectedCredential || null
  );
  const fromEmail = useRef(fieldData?.fromEmail || "");
  const toEmail = useRef(fieldData?.toEmail || "");
  const subject = useRef(fieldData?.subject || "");
  const htmlMail = useRef(fieldData?.htmlMail || "");

  const [selectedCredential, setSelectedCredential] =
    useState<ICredentials | null>(null);
  const [fromEmailInput, setFromEmailInput] = useState(fromEmail.current);
  const [toEmailInput, setToEmailInput] = useState(toEmail.current);
  const [subjectInput, setSubjectInput] = useState(subject.current);
  const [htmlMailInput, setHtmlMailInput] = useState(htmlMail.current);

  const editEmailNodeHandler = useCallback(() => {
    selectedCred.current = selectedCredential;
    fromEmail.current = fromEmailInput;
    toEmail.current = toEmailInput;
    subject.current = subjectInput;
    htmlMail.current = htmlMailInput;

    data.onDataUpdate(id, {
      selectedCred: selectedCred.current,
      fromEmail: fromEmail.current,
      toEmail: toEmail.current,
      subject: subject.current,
      htmlMail: htmlMail.current,
    });
  }, [
    selectedCredential,
    fromEmailInput,
    toEmailInput,
    subjectInput,
    htmlMailInput,
    data.onDataUpdate,
  ]);

  const deleteEmailNodeHandler = useCallback(
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
    editEmailNodeHandler();
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
          <Dialog.Title>Edit Email Node</Dialog.Title>
          <Dialog.Description mb="4">
            Enter the details required below
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <SelectCredential
                selectedCredential={selectedCredential}
                onSelect={onSelectedCredentialChange}
              />
            </label>

            <label>
              <div className="mb-1 font-bold">From Email</div>
              <TextField.Root
                placeholder="admin@example.com"
                value={fromEmailInput}
                onChange={(e) => {
                  setFromEmailInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <div className="mt-2">
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
            </div>

            <label>
              <div className="mb-1 font-bold">To Email</div>
              <TextField.Root
                placeholder="info@example.com"
                value={toEmailInput}
                onChange={(e) => {
                  setToEmailInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">Subject Email</div>
              <TextField.Root
                placeholder="My subject line"
                value={subjectInput}
                onChange={(e) => {
                  setSubjectInput(e.target.value);
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">HTML</div>
              <TextArea
                placeholder="Enter HTML content here"
                value={htmlMailInput}
                onChange={(e) => {
                  setHtmlMailInput(e.target.value);
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
                onClick={() => editEmailNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Mail size={28} />
        <div className="font-bold text-md">Email</div>
        {/* <div>{item.title}</div> */}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteEmailNodeHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default EmailNode;
