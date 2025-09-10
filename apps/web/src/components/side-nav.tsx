import { useUserSession } from "@/store/user";
import { useNavigate } from "@tanstack/react-router";
import { Home, KeySquare, User } from "lucide-react";
import { Popover } from "radix-ui";

export function SideNav() {
  const navigate = useNavigate();
  const userSession = useUserSession(s => s.user);
  const updateUserSession = useUserSession(s => s.updateUserSession);

  function signOutHandler() { 
    updateUserSession(null);
  }

  function navigateToWorkflows() {
    navigate({ to: "/workflows" });
  }


  function navigateToCredentials() {
    navigate({ to: "/credentials" });
  }

  return (
    <div className="bg-item w-64 h-full flex flex-col justify-between border-r-1 border-lightborder">
      <div className="flex flex-col">
        <span className="font-bold m-4">Workflow-Gen</span>
        <button
          className="m-2 p-4 hover:bg-highlighted rounded-sm hover:cursor-pointer"
          onClick={() => navigateToWorkflows()}
        >
          <div className="flex gap-4">
            <Home />
            <div>Workflows</div>
          </div>
        </button>

        <button
          className="m-2 p-4 hover:bg-highlighted rounded-sm hover:cursor-pointer"
          onClick={() => navigateToCredentials()}
        >
          <div className="flex gap-4">
            <KeySquare />
            <div>Credentials</div>
          </div>
        </button>
      </div>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="m-2 p-4 hover:bg-highlighted hover:cursor-pointer rounded-sm">
            <div className="flex items-center gap-4">
              <User className="h-5 w-5" />
              <div className="truncate max-w-[calc(100%-2.5rem)] text-sm">
                {userSession && userSession.email}
              </div>
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="top"
            sideOffset={5}
            align="center"
            className="z-50 w-48 p-4 bg-background rounded-md shadow-lg transition-all"
          >
            <div className="flex flex-col gap-2 ">
              <button
                className="text-sm text-white hover:cursor-pointer w-full"
                onClick={() => signOutHandler()}
              >
                Sign Out
              </button>
            </div>
            <Popover.Arrow className="fill-background" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
