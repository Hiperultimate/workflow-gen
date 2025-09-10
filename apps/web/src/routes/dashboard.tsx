import { SideNav } from '@/components/side-nav'
import { useUserSession } from '@/store/user';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

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
      <div>Workflows</div>
    </div>
  );
}
