import { Mail, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useRef } from "react";
import NodeWrapper from "./NodeWrapper";
import { Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { Handle, Position } from "@xyflow/react";
import SelectCredential from "../select-credential";

function EmailNode() {
  const fromEmailInput = useRef("");
  const toEmailInput = useRef("");
  const subjectInput = useRef("");
  const htmlMailInput = useRef("");

  // New saved state
  const fromEmail = useRef("");
  const toEmail = useRef("");
  const subject = useRef("");
  const htmlMail = useRef("");

  //   const onChange = useCallback((evt) => {
  //     console.log(evt.target.value);
  //   }, []);
  const editEmailNodeHandler = useCallback(() => {
    fromEmail.current = fromEmailInput.current;
    toEmail.current = toEmailInput.current;
    subject.current = subjectInput.current;
    htmlMail.current = htmlMailInput.current;
    console.log(
      "Checking values :",

      fromEmail.current,
      toEmail.current,
      subject.current,
      htmlMail.current
    );
  }, []);

  const deleteEmailNodeHandler = useCallback(() => {
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
          <Dialog.Title>Edit Email Node</Dialog.Title>
          <Dialog.Description mb="4">
            Enter the details required below
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
              <div className="mb-1 font-bold">From Email</div>
              <TextField.Root
                placeholder="admin@example.com"
                onChange={(e) => {
                  fromEmailInput.current = e.target.value;
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">To Email</div>
              <TextField.Root
                placeholder="info@example.com"
                onChange={(e) => {
                  toEmailInput.current = e.target.value;
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">Subject Email</div>
              <TextField.Root
                placeholder="My subject line"
                onChange={(e) => {
                  subjectInput.current = e.target.value;
                }}
              >
                <TextField.Slot />
              </TextField.Root>
            </label>

            <label>
              <div className="mb-1 font-bold">HTML</div>
              <TextArea
                placeholder="Enter HTML content here"
                onChange={(e) => {
                  htmlMailInput.current = e.target.value;
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
          onClick={() => deleteEmailNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default EmailNode;
