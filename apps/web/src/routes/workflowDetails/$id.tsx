import { getWorkflowById } from '@/api/getWorkflowById';
import Flow from '@/components/customize-workflow';
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

  return (
    <div className="flex ">
      <SideNav />

      {isLoading && <div>Loading...</div>}
      {data && <Flow workflowData={data} />}
    </div>
  );
}
