import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "workflow-gen",
      },
      {
        name: "description",
        content: "workflow-gen is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

const queryClient = new QueryClient();

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeadContent />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            {isFetching ? <Loader /> : <Outlet />}
          </div>
          <Toaster closeButton richColors />
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-left" />
      </QueryClientProvider>
    </>
  );
}
