"use server";

import { createPaginatedResponse, getPaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { transactionSchema } from "@/lib/validations/finance";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import * as z from "zod";

export const getTransactions = authActionClient
   .schema(
      z.object({
         page: z.coerce.number().int().positive().default(1),
      })
   )
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("finance-transactions");

      const { page, limit, skip } = getPaginationParams({
         page: parsedInput.page,
      });

      const [transactions, total] = await Promise.all([
         prisma.transaction.findMany({
            where: { userId: ctx.userId, deletedAt: null },
            include: { category: true },
            orderBy: { date: "desc" },
            skip,
            take: limit,
         }),
         prisma.transaction.count({
            where: { userId: ctx.userId, deletedAt: null },
         }),
      ]);

      return createPaginatedResponse(transactions, total, page, limit);
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
      updateTag("dashboard-loans-savings");
      updateTag("dashboard-borrowed");
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
      updateTag("dashboard-loans-savings");
      updateTag("dashboard-borrowed");
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
      updateTag("dashboard-loans-savings");
      updateTag("dashboard-borrowed");
   });
