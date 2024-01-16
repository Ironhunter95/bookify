import { clientsRouter } from "~/server/api/routers/clients";
import { createTRPCRouter } from "~/server/api/trpc";
import { reservationsRouter } from "./routers/reservations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  clients: clientsRouter,
  reservations: reservationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
