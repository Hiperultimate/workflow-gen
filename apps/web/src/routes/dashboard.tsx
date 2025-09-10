import { SideNav } from '@/components/side-nav'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <SideNav>

    </SideNav>
  </div>
}
