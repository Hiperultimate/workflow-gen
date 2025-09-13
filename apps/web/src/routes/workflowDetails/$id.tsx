import { getWorkflowById } from '@/api/getWorkflowById';
import NotFound from '@/components/page-not-found';
import { SideNav } from '@/components/side-nav'
import type { IGetSingleWorkflow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/workflowDetails/$id')({
  component: RouteComponent,
  notFoundComponent: NotFound
})

function RouteComponent() {
  const { id } = useParams({ strict: false });

  if (!id) {
    throw new Error("Invalid url");
  }

  const { data, isLoading, isError } = useQuery<IGetSingleWorkflow>({
    queryKey: ["workflow", id],
    queryFn: async () => getWorkflowById(id),
  });

  console.log("Getting workflow data : ", data);

  return (
    <div className="flex ">
      <SideNav />
      <div className="w-full">
        <div className="bg-item w-full p-4 flex justify-between">
          <div>{data?.workflow.title}</div>
          <button className="bg-pop px-4 py-2 hover:bg-pophover hover:cursor-pointer rounded-md">Save</button>
        </div>
        Hello "/workflowDetails/"!
      </div>
    </div>
  );
}
