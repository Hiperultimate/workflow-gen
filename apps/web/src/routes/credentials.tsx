import {
  Dialog,
  Flex,
  Text,
  TextField,
  Button as RadixButton,
  TextArea,
} from "@radix-ui/themes";
import { SideNav } from "@/components/side-nav";
import { Button } from "@/components/ui/button";
import { useUserSession } from "@/store/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/credentials")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  return (
    <div className="w-full flex">
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
              <button className="flex gap-2 bg-pop hover:bg-pophover transition-colors px-6 py-4 rounded-md hover:cursor-pointer">
                <Plus />
                <span>Add Credentials</span>
              </button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>Add Credentials</Dialog.Title>
              <Dialog.Description>
                Select an app or service to add
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <div className="mb-1 font-bold">
                    Title
                  </div>
                  <TextField.Root
                    defaultValue="Freja Johnsen"
                    placeholder="Enter your full name"
                  />
                </label>
                <label>
                  <div className="mb-1 font-bold">
                    Key
                  </div>
                  <TextArea
                    placeholder="{json:data}"
                  />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <RadixButton variant="outline">Cancel</RadixButton>
                </Dialog.Close>
                <Dialog.Close>
                  <RadixButton>Save</RadixButton>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}
