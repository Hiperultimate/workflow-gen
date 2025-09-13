import { SideNav } from '@/components/side-nav'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workflowDetails/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SideNav />
      Hello "/workflowDetails/"!
    </div>
  );
}
