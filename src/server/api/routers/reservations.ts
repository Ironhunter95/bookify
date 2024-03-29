import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reservationsRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        client: z.object({ name: z.string(), id: z.number() }),
        allowed: z.boolean().default(false),
        arrivalDate: z.string().optional(),
        arrivalTime: z.string().optional(),
        notes: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.reservations.create({
        data: {
          clientsId: input.client.id,
          allowed: input.allowed,
          arrivalTime: input.arrivalTime ?? "",
          arrivalDate: input.arrivalDate ?? "",
          notes: input.notes,
        },
      });

      return client;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const reservations = await ctx.db.reservations.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
      },
    });
    return reservations;
  }),
  getList: publicProcedure.query(async ({ ctx }) => {
    const reservations = await ctx.db.reservations.findMany({
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  }),
  getPages: publicProcedure.query(async ({ ctx }) => {
    const totalRows = await ctx.db.reservations.count();
    return Math.ceil(totalRows / 12);
  }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.reservations.delete({
        where: {
          id: input.id,
        },
      });
      return true;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        allowed: z.boolean(),
        arrivalTime: z.string().optional(),
        arrivalDate: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservations.update({
        where: { id: input.id },
        data: {
          allowed: input.allowed,
          arrivalTime: input.arrivalTime,
          arrivalDate: input.arrivalDate,
          notes: input.notes,
        },
      });

      return reservation;
    }),
});
