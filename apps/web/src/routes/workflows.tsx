import { createWorkflow } from "@/api/createWorkflow-post";
import { SideNav } from "@/components/side-nav";
import { useUserSession } from "@/store/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Popover } from "radix-ui";
import { toast } from "sonner";
import { useRef } from "react";
import { userWorkflows } from "@/api/userWorkflows-get";
import Loader from "@/components/loader";
import type { IWorkflows } from "@/types";
import { Switch } from "@radix-ui/themes";

export const Route = createFileRoute("/workflows")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const title = useRef("");

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  const {
    data: allWorkflows,
    isLoading,
    isError,
  } = useQuery<IWorkflows>({
    queryKey: ["workflows"],
    queryFn: userWorkflows,
  });

  const initiateWorkflowCreation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: (data) => {
      navigate({ to: `/workflowDetails/${data.id}` });
    },
  });

  // Check if workflow is working or not
  function createWorkflowHandler() {
    toast.promise(initiateWorkflowCreation.mutateAsync(title.current), {
      loading: "Creating workflow...",
      success: "Workflow created successfully!",
      error: (err) => `Error: ${err.message}`,
    });
  }

  function openExistingWorkflowHandler(id: string) {
    navigate({ to: `/workflowDetails/${id}` });
  }

  console.log("Checking workflow data : ", allWorkflows);

  return (
    <div className="w-full flex text-white">
      <SideNav />
      <div className="bg-graybg h-full w-full px-12 p-8">
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-3xl">Workflows</div>
            <div className="text-sm text-gray-400">
              All the workflows, credentials and executions you have access to
            </div>
          </div>

          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="flex gap-2 bg-pop hover:bg-pophover transition-colors px-6 py-4 rounded-md hover:cursor-pointer">
                <Plus />
                <span>Create Workflow</span>
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                side="top"
                sideOffset={5}
                align="center"
                className="z-50 w-72 p-6 bg-highlighted rounded-lg shadow-lg transition-all"
              >
                <label
                  htmlFor="workflow-title"
                  className="block text-sm font-semibold mb-2"
                >
                  Workflow Title
                </label>

                <input
                  id="workflow-title"
                  type="text"
                  placeholder="Enter title for your new workflow"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  onChange={(e) => (title.current = e.target.value)}
                />

                <button
                  className="bg-graybg px-4 py-2 rounded-md mt-4 w-full hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    createWorkflowHandler();
                  }}
                >
                  Submit
                </button>

                <Popover.Arrow className="fill-highlighted" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <Loader size={38} />
          ) : (
            allWorkflows &&
            allWorkflows.workflows &&
            allWorkflows.workflows.map((item) => {
              return (
                <div
                  className="bg-item rounded-sm border-1 border-lightborder my-2 p-4 flex justify-between items-center hover:cursor-pointer hover:bg-white/30"
                  onClick={() => {
                    openExistingWorkflowHandler(item.id);
                  }}
                  key={item.id}
                >
                  <div className="flex items-center">
                    <div>{item.title}</div>
                  </div>
                  <div className="font-bold flex items-center">
                    <span className="text-gray-400 text-sm mr-2">
                      {item.enabled ? "Active" : "Inactive"}
                    </span>
                    <Switch color="orange" checked={item.enabled} />
                  </div>
                  {/* <X
                    className="hover:cursor-pointer"
                    onClick={() => removeWorkflowHandler(item.id)}
                  /> */}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
