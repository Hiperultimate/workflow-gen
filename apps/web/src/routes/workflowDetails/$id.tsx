import { getWorkflowById } from '@/api/getWorkflowById';
import Flow from '@/components/customize-workflow';
import NotFound from '@/components/page-not-found';
import { SideNav } from '@/components/side-nav'
import { useUserSession } from '@/store/user';
import type { IGetSingleWorkflow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/workflowDetails/$id')({
  component: RouteComponent,
  notFoundComponent: NotFound
})

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const { id } = useParams({ strict: false });

  if (!id) {
    throw new Error("Invalid url");
  }

  if (!user) {
    navigate({ to: "/" });
    return <></>;
  }

  const { data, isLoading, isError } = useQuery<IGetSingleWorkflow>({
    queryKey: ["workflow", id],
    queryFn: async () => getWorkflowById(id),
  });

  return (
    <div className="flex ">
      <SideNav />

      {isLoading && <div className="font-bold bg-highlighted flex items-center justify-center w-full">Loading...</div>}
      {data && <Flow workflowData={data} />}
    </div>
  );
}
