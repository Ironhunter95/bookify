import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const clientsRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        position: z.string(),
        unit: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.clients.create({
        data: {
          name: input.name,
          position: input.position,
          unit: input.unit,
        },
      });

      return client;
    }),
  getAll: publicProcedure
    .input(
      z.object({ page: z.number().optional(), query: z.string().optional() }),
    )
    .query(async ({ ctx, input }) => {
      const clients = await ctx.db.clients.findMany({
        where: {
          name: { contains: input.query ?? "" },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
        skip: ((input.page ?? 1) - 1) * 12,
      });
      return clients;
    }),
  getList: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.clients.findMany({
      orderBy: { createdAt: "desc" },
      select: { name: true, id: true },
    });
    return users;
  }),
  getPages: publicProcedure.query(async ({ ctx }) => {
    const totalRows = await ctx.db.clients.count();
    return Math.ceil(totalRows / 12);
  }),
});
