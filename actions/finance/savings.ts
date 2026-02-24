"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { savingsSchema } from "@/lib/validations/savings";
import { updateTag } from "next/cache";
import * as z from "zod";

export const getSavings = authActionClient.action(async ({ ctx }) => {
   const savings = await prisma.savings.findMany({
      where: {
         userId: ctx.userId,
      },
      include: { category: true },
      orderBy: { savingsDate: "desc" },
   });
   return savings;
});

export const createSavings = authActionClient
   .schema(savingsSchema)
   .action(async ({ parsedInput, ctx }) => {
      const category = await prisma.financeCategory.findUnique({
         where: { id: parsedInput.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const savings = await prisma.savings.create({
         data: {
            ...parsedInput,
            userId: ctx.userId,
         },
         include: { category: true },
      });

      updateTag("finance-savings");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      return savings;
   });

export const updateSavings = authActionClient
   .schema(
      savingsSchema.extend({
         id: z.string().min(1),
      })
   )
   .action(async ({ parsedInput, ctx }) => {
      const { id, ...data } = parsedInput;

      const savings = await prisma.savings.findUnique({
         where: { id },
      });

      if (!savings || savings.userId !== ctx.userId) {
         throw new Error("Savings not found");
      }

      const category = await prisma.financeCategory.findUnique({
         where: { id: data.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const updated = await prisma.savings.update({
         where: { id },
         data,
         include: { category: true },
      });

      updateTag("finance-savings");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      return updated;
   });

export const deleteSavings = authActionClient
   .schema(z.object({ id: z.string().min(1) }))
   .action(async ({ parsedInput, ctx }) => {
      const savings = await prisma.savings.findUnique({
         where: { id: parsedInput.id },
      });

      if (!savings || savings.userId !== ctx.userId) {
         throw new Error("Savings not found");
      }

      await prisma.savings.delete({
         where: { id: parsedInput.id },
      });

      updateTag("finance-savings");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
   });
