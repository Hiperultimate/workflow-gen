import authRoutes from "./authRoutes";
import credentialRoutes from "./credentialRoutes";
import workflowRoutes from "./workflowRoutes";

export const appRouter = { authRoutes, workflowRoutes, credentialRoutes };
export type AppRouter = typeof appRouter;
