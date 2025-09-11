import {
  Dialog,
  Flex,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { SideNav } from "@/components/side-nav";
import { useUserSession } from "@/store/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/credentials")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const platform = useRef('email');
  const title = useRef('');
  const apiKeys = useRef('');

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  function onSaveHandler(){
    console.log("Checking output :", platform.current, title.current, title.current,apiKeys.current);
  }

  return (
    <div className="w-full flex text-white">
      <SideNav />
      <div className="bg-graybg h-full w-full px-12 p-8">
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-3xl">Credentials</div>
            <div className="text-sm text-gray-400">
              All the workflows, credentials, and executions you have access to
            </div>
          </div>

          <Dialog.Root>
            <Dialog.Trigger>
              <button className="flex gap-2 bg-pop hover:bg-pophover transition-colors px-6 pt-4 rounded-md hover:cursor-pointer">
                <Plus />
                <span>Add Credentials</span>
              </button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>Add Credentials</Dialog.Title>
              <Dialog.Description mb="4">
                Select an app or service to add
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <div className="mb-1 font-bold">Platforms</div>
                  {/* Select button */}
                  <Select.Root size="2" defaultValue={platform.current} onValueChange={(val) => {platform.current = val}}>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Platforms</Select.Label>
                        <Select.Item value="telegram">Telegram</Select.Item>
                        <Select.Item value="email">Email</Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <div className="mb-1 font-bold">Title</div>
                  <TextField.Root placeholder="Enter a title for your key" onChange={(val) => {title.current = val.target.value}}>
                    <TextField.Slot/>
                  </TextField.Root>
                </label>
                <label>
                  <div className="mb-1 font-bold">API Key</div>
                  <TextArea placeholder="{json:data}" onChange={(val) => {apiKeys.current = val.target.value}} />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <button className="bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 hover:cursor-pointer">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close>
                  <button className="bg-pop px-4 py-2 rounded-md hover:bg-pophover hover:cursor-pointer" onClick={() => onSaveHandler()}>
                    Save
                  </button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}
