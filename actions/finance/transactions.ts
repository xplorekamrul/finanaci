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
      cacheLife("hours");
      cacheTag("finance-transactions-all");
      cacheTag(`finance-transactions-page-${parsedInput.page}`);

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

      updateTag("finance-transactions-all");
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

      updateTag("finance-transactions-all");
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

      updateTag("finance-transactions-all");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-categories");
      updateTag("dashboard-loans-savings");
      updateTag("dashboard-borrowed");
   });

// Filtered transactions action
export const getFilteredTransactions = authActionClient
   .schema(
      z.object({
         page: z.coerce.number().int().positive().default(1),
         startDate: z.date().optional(),
         endDate: z.date().optional(),
         categoryId: z.string().optional(),
         type: z.enum(["INCOME", "EXPENSE"]).optional(),
      })
   )
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("finance-transactions-filtered");

      const { page, limit, skip } = getPaginationParams({
         page: parsedInput.page,
      });

      const where: any = {
         userId: ctx.userId,
         deletedAt: null,
      };

      if (parsedInput.startDate && parsedInput.endDate) {
         where.date = {
            gte: parsedInput.startDate,
            lte: parsedInput.endDate,
         };
      }

      if (parsedInput.categoryId) {
         where.categoryId = parsedInput.categoryId;
      }

      if (parsedInput.type) {
         where.type = parsedInput.type;
      }

      const [transactions, total] = await Promise.all([
         prisma.transaction.findMany({
            where,
            include: { category: true },
            orderBy: { date: "desc" },
            skip,
            take: limit,
         }),
         prisma.transaction.count({ where }),
      ]);

      return createPaginatedResponse(transactions, total, page, limit);
   });

// Get transaction sums based on filters
export const getTransactionSums = authActionClient
   .schema(
      z.object({
         startDate: z.date().optional(),
         endDate: z.date().optional(),
         categoryId: z.string().optional(),
         type: z.enum(["INCOME", "EXPENSE"]).optional(),
      })
   )
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("finance-transactions-sums");

      const where: any = {
         userId: ctx.userId,
         deletedAt: null,
      };

      if (parsedInput.startDate && parsedInput.endDate) {
         where.date = {
            gte: parsedInput.startDate,
            lte: parsedInput.endDate,
         };
      }

      if (parsedInput.categoryId) {
         where.categoryId = parsedInput.categoryId;
      }

      if (parsedInput.type) {
         where.type = parsedInput.type;
      }

      const transactions = await prisma.transaction.findMany({
         where,
         select: {
            amount: true,
            type: true,
         },
      });

      const income = transactions
         .filter((t) => t.type === "INCOME")
         .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
         .filter((t) => t.type === "EXPENSE")
         .reduce((sum, t) => sum + t.amount, 0);

      return {
         income,
         expense,
         total: income - expense,
      };
   });
