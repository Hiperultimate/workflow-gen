 import { Dialog, Flex, TextField, TextArea, Select, Tooltip } from "@radix-ui/themes";
import { SideNav } from "@/components/side-nav";
import { useUserSession } from "@/store/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
 import { Brain, Info, MailIcon, Plus, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCredential } from "@/api/createCredential-post";
import { getUserCredentials } from "@/api/getUserCredentials-get";
import { toast } from "sonner";
import { Platforms, type ICredentials } from "@/types";
import { removeCredentials } from "@/api/removeCredentials-delete";
import Loader from "@/components/loader";

export const Route = createFileRoute("/credentials")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const [platform, setPlatform] = useState("Email");
  const title = useRef("");
  const apiKeys = useRef("");

  const [placeholder, setPlaceholder] = useState('{"api":"apiString"}');
  const queryClient = useQueryClient();

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  const {
    data: userCredentials,
    isLoading,
    isError,
  } = useQuery<{ credentials: ICredentials[] } | null>({
    queryKey: ["credentials"],
    queryFn: getUserCredentials,
  });

  const removeCredential = useMutation({
    mutationFn: removeCredentials,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });

  const addCredential = useMutation({
    mutationFn: createCredential,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });

  function removeCredentialHandler(id: string) {
    toast.promise(removeCredential.mutateAsync(id), {
      loading: "Removing credentials...",
      success: "Credential removed successfully!",
      error: (err) => `Error: ${err.message}`,
    });
  }

  function onSaveHandler() {
    toast.promise(
      addCredential.mutateAsync({
        title: title.current,
        platform: platform,
        data: apiKeys.current,
      }),
      {
        loading: "Saving credentials...",
        success: "Credential saved successfully!",
        error: (err) => `Error: ${err.message}`,
      }
    );
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
                   <Select.Root
                     size="2"
                     defaultValue={platform}
                     onValueChange={(val) => {
                       setPlatform(val);
                       if (val === "Telegram") {
                         setPlaceholder('{"botApi":"apiKey"}');
                       } else if (val === "Email") {
                         setPlaceholder('{"api":"apiString"}');
                       } else {
                         setPlaceholder("{json:data}");
                       }
                     }}
                   >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Platforms</Select.Label>
                        <Select.Item value="Telegram">Telegram</Select.Item>
                        <Select.Item value="Email">Email</Select.Item>
                        <Select.Item value="Gemini">Gemini</Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <div className="mb-1 font-bold">Title</div>
                  <TextField.Root
                    placeholder="Enter a title for your key"
                    onChange={(val) => {
                      title.current = val.target.value;
                    }}
                  >
                    <TextField.Slot />
                  </TextField.Root>
                </label>
                 <label>
                   <div className="mb-1 font-bold flex items-center gap-2">
                     API Key
                     {platform === "Telegram" && (
                       <Tooltip content="User must have started chatting with the telegram bot to start receiving message">
                         <Info size={16} className="text-gray-400" />
                       </Tooltip>
                     )}
                   </div>
                   <TextArea
                     placeholder={placeholder}
                     onChange={(val) => {
                       apiKeys.current = val.target.value;
                     }}
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
                    onClick={() => onSaveHandler()}
                  >
                    Save
                  </button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <Loader size={38} />
          ) : (
            userCredentials &&
            userCredentials.credentials &&
            userCredentials.credentials.map((item) => {
              return (
                <div
                  className="bg-item rounded-sm border-1 border-lightborder my-2 p-4 flex justify-between items-center"
                  key={item.id}
                >
                  <div className="flex items-center">
                    {item.platform === Platforms.Email && (
                      <MailIcon size={34} className="mr-4" />
                    )}
                    {item.platform === Platforms.Telegram && (
                      <Send size={34} className="mr-4" />
                    )}
                    {item.platform === Platforms.Gemini && (
                      <Brain size={34} className="mr-4" />
                    )}
                    <div>
                      <div className="font-bold text-xl">{item.platform}</div>
                      <div>{item.title}</div>
                    </div>
                  </div>
                  <X
                    className="hover:cursor-pointer"
                    onClick={() => removeCredentialHandler(item.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
