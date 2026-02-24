"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { transactionSchema } from "@/lib/validations/finance";
import { updateTag } from "next/cache";
import * as z from "zod";

export const getTransactions = authActionClient.action(async ({ ctx }) => {
   const transactions = await prisma.transaction.findMany({
      where: { userId: ctx.userId, deletedAt: null },
      include: { category: true },
      orderBy: { date: "desc" },
   });
   return transactions;
});

export const createTransaction = authActionClient
   .schema(transactionSchema)
   .action(async ({ parsedInput, ctx }) => {
      const category = await prisma.financeCategory.findUnique({
         where: { id: parsedInput.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const transaction = await prisma.transaction.create({
         data: {
            ...parsedInput,
            userId: ctx.userId,
         },
         include: { category: true },
      });

      updateTag("finance-transactions");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-categories");
      return transaction;
   });

export const updateTransaction = authActionClient
   .schema(
      transactionSchema.extend({
         id: z.string().min(1),
      })
   )
   .action(async ({ parsedInput, ctx }) => {
      const { id, ...data } = parsedInput;

      const transaction = await prisma.transaction.findUnique({
         where: { id },
      });

      if (!transaction || transaction.userId !== ctx.userId) {
         throw new Error("Transaction not found");
      }

      const category = await prisma.financeCategory.findUnique({
         where: { id: data.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const updated = await prisma.transaction.update({
         where: { id },
         data,
         include: { category: true },
      });

      updateTag("finance-transactions");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-categories");
      return updated;
   });

export const deleteTransaction = authActionClient
   .schema(z.object({ id: z.string().min(1) }))
   .action(async ({ parsedInput, ctx }) => {
      const transaction = await prisma.transaction.findUnique({
         where: { id: parsedInput.id },
      });

      if (!transaction || transaction.userId !== ctx.userId) {
         throw new Error("Transaction not found");
      }

      await prisma.transaction.delete({
         where: { id: parsedInput.id },
      });

      updateTag("finance-transactions");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-categories");
   });
