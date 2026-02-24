"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { borrowedSchema } from "@/lib/validations/borrowed";
import { updateTag } from "next/cache";
import * as z from "zod";

export const getBorrowed = authActionClient.action(async ({ ctx }) => {
   const borrowed = await prisma.borrowed.findMany({
      where: { userId: ctx.userId },
      include: { category: true },
      orderBy: { borrowDate: "desc" },
   });
   return borrowed;
});

export const createBorrowed = authActionClient
   .schema(borrowedSchema)
   .action(async ({ parsedInput, ctx }) => {
      if (parsedInput.categoryId) {
         const category = await prisma.financeCategory.findUnique({
            where: { id: parsedInput.categoryId },
         });

         if (!category || category.userId !== ctx.userId) {
            throw new Error("Category not found");
         }
      }

      const borrowed = await prisma.borrowed.create({
         data: {
            ...parsedInput,
            userId: ctx.userId,
         },
         include: { category: true },
      });

      updateTag("finance-borrowed");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      return borrowed;
   });

export const updateBorrowed = authActionClient
   .schema(
      borrowedSchema.extend({
         id: z.string().min(1),
      })
   )
   .action(async ({ parsedInput, ctx }) => {
      const { id, ...data } = parsedInput;

      const existing = await prisma.borrowed.findUnique({
         where: { id },
      });

      if (!existing || existing.userId !== ctx.userId) {
         throw new Error("Borrowed record not found");
      }

      if (data.categoryId) {
         const category = await prisma.financeCategory.findUnique({
            where: { id: data.categoryId },
         });

         if (!category || category.userId !== ctx.userId) {
            throw new Error("Category not found");
         }
      }

      const borrowed = await prisma.borrowed.update({
         where: { id },
         data,
         include: { category: true },
      });

      updateTag("finance-borrowed");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      return borrowed;
   });

export const deleteBorrowed = authActionClient
   .schema(z.object({ id: z.string().min(1) }))
   .action(async ({ parsedInput, ctx }) => {
      const existing = await prisma.borrowed.findUnique({
         where: { id: parsedInput.id },
      });

      if (!existing || existing.userId !== ctx.userId) {
         throw new Error("Borrowed record not found");
      }

      await prisma.borrowed.delete({
         where: { id: parsedInput.id },
      });

      updateTag("finance-borrowed");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      return { success: true };
   });
