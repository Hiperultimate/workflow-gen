import { getWorkflowById } from "@/api/getWorkflowById";
import Flow from "@/components/customize-workflow";
import NotFound from "@/components/page-not-found";
import { SideNav } from "@/components/side-nav";
import { useEventSource } from "@/store/nodeEvents";
import { useUserSession } from "@/store/user";
import type { IGetSingleWorkflow } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/workflowDetails/$id")({
  component: RouteComponent,
  notFoundComponent: NotFound,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const setEventSource = useEventSource((s) => s.updateEventSource);
  const { id } = useParams({ strict: false });

  if (!id) {
    throw new Error("Invalid url");
  }

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  const { data, isLoading, isError, isSuccess } = useQuery<IGetSingleWorkflow>({
    queryKey: ["workflow", id],
    queryFn: async () => getWorkflowById(id),
  });

  // TODO : get url from env file
  useEffect(() => {
    if (!isSuccess) return;
    const eventSource = new EventSource(
      `http://localhost:3000/node-updates/${id}`
    );
    setEventSource(eventSource);
    console.log("Event source set successfully...", id);

    return () => { 
      setEventSource(null);
    }
  }, [data, isSuccess]);

  return (
    <div className="flex ">
      <SideNav />

      {isLoading && (
        <div className="font-bold bg-highlighted flex items-center justify-center w-full">
          Loading...
        </div>
      )}
      {data && <Flow workflowData={data} />}
    </div>
  );
}
