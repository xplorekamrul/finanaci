"use server";

import { createPaginatedResponse, getPaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { financeCategorySchema } from "@/lib/validations/finance";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import * as z from "zod";

export const getFinanceCategories = authActionClient
   .schema(
      z.object({
         page: z.coerce.number().int().positive().default(1),
      })
   )
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("hours");
      cacheTag("finance-categories-all");
      cacheTag(`finance-categories-page-${parsedInput.page}`);

      const { page, limit, skip } = getPaginationParams({
         page: parsedInput.page,
      });

      const [categories, total] = await Promise.all([
         prisma.financeCategory.findMany({
            where: { userId: ctx.userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
         }),
         prisma.financeCategory.count({
            where: { userId: ctx.userId },
         }),
      ]);

      return createPaginatedResponse(categories, total, page, limit);
   });

export const getAllFinanceCategories = authActionClient
   .action(async ({ ctx }) => {
      "use cache";
      cacheLife("hours");
      cacheTag("finance-categories");

      const categories = await prisma.financeCategory.findMany({
         where: { userId: ctx.userId },
         orderBy: { createdAt: "desc" },
      });

      return categories;
   });

export const createFinanceCategory = authActionClient
   .schema(financeCategorySchema)
   .action(async ({ parsedInput, ctx }) => {
      const existing = await prisma.financeCategory.findFirst({
         where: {
            userId: ctx.userId,
            name: parsedInput.name,
            type: parsedInput.type,
         },
      });

      if (existing) {
         return {
            data: null,
            serverError: "Category with this name and type already exists",
         };
      }

      try {
         const category = await prisma.financeCategory.create({
            data: {
               ...parsedInput,
               userId: ctx.userId,
            },
         });

         updateTag("finance-categories");
         updateTag("finance-categories-all");
         updateTag("dashboard-stats");
         updateTag("dashboard-chart");
         updateTag("dashboard-categories");
         updateTag("finance-transactions-all");
         updateTag("finance-borrowed-all");
         updateTag("finance-loans-all");
         updateTag("finance-savings-all");

         return category;
      } catch (error) {
         console.error("Failed to create category:", error);
         return {
            data: null,
            serverError: error instanceof Error ? error.message : "Failed to create category",
         };
      }
   });

export const updateFinanceCategory = authActionClient
   .schema(
      financeCategorySchema.extend({
         id: z.string().min(1),
      })
   )
   .action(async ({ parsedInput, ctx }) => {
      const { id, ...data } = parsedInput;

      const category = await prisma.financeCategory.findUnique({
         where: { id },
      });

      if (!category || category.userId !== ctx.userId) {
         return {
            data: null,
            serverError: "Category not found",
         };
      }

      const existing = await prisma.financeCategory.findFirst({
         where: {
            userId: ctx.userId,
            name: data.name,
            type: data.type,
            id: { not: id },
         },
      });

      if (existing) {
         return {
            data: null,
            serverError: "Category with this name and type already exists",
         };
      }

      try {
         const updated = await prisma.financeCategory.update({
            where: { id },
            data,
         });

         updateTag("finance-categories-all");
         updateTag("dashboard-stats");
         updateTag("dashboard-chart");
         updateTag("dashboard-categories");
         updateTag("finance-transactions-all");
         updateTag("finance-borrowed-all");
         updateTag("finance-loans-all");
         updateTag("finance-savings-all");
         return updated;
      } catch (error) {
         console.error("Failed to update category:", error);
         return {
            data: null,
            serverError: error instanceof Error ? error.message : "Failed to update category",
         };
      }
   });

export const deleteFinanceCategory = authActionClient
   .schema(z.object({ id: z.string().min(1) }))
   .action(async ({ parsedInput, ctx }) => {
      const category = await prisma.financeCategory.findUnique({
         where: { id: parsedInput.id },
      });

      if (!category || category.userId !== ctx.userId) {
         return {
            data: null,
            serverError: "Category not found",
         };
      }

      try {
         await prisma.financeCategory.delete({
            where: { id: parsedInput.id },
         });

         updateTag("finance-categories-all");
         updateTag("dashboard-stats");
         updateTag("dashboard-chart");
         updateTag("dashboard-categories");
         updateTag("finance-transactions-all");
         updateTag("finance-borrowed-all");
         updateTag("finance-loans-all");
         updateTag("finance-savings-all");
      } catch (error) {
         console.error("Failed to delete category:", error);
         return {
            data: null,
            serverError: error instanceof Error ? error.message : "Failed to delete category",
         };
      }
   });
