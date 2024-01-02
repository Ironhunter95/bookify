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
  getAll: publicProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.clients.findMany({
      orderBy: { createdAt: "desc" },
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
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.clients.delete({
        where: {
          id: input.id,
        },
      });
      return true;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        position: z.string(),
        unit: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.clients.update({
        where: { id: input.id },
        data: {
          name: input.name,
          position: input.position,
          unit: input.unit,
        },
      });

      return client;
    }),
});
