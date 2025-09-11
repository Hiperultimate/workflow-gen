import { SideNav } from "@/components/side-nav";
import { useUserSession } from "@/store/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/workflows")({
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

          <button className="flex gap-2 bg-pop hover:bg-pophover transition-colors px-6 py-4 rounded-md hover:cursor-pointer">
            <Plus />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
