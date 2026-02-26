"use server";

import { createPaginatedResponse, getPaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { loanSchema } from "@/lib/validations/loans";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import * as z from "zod";

export const getLoans = authActionClient
   .schema(
      z.object({
         page: z.coerce.number().int().positive().default(1),
      })
   )
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("finance-loans");

      const { page, limit, skip } = getPaginationParams({
         page: parsedInput.page,
      });

      const [loans, total] = await Promise.all([
         prisma.loan.findMany({
            where: {
               userId: ctx.userId,
            },
            include: { category: true },
            orderBy: { loanDate: "desc" },
            skip,
            take: limit,
         }),
         prisma.loan.count({
            where: { userId: ctx.userId },
         }),
      ]);

      return createPaginatedResponse(loans, total, page, limit);
   });

export const createLoan = authActionClient
   .schema(loanSchema)
   .action(async ({ parsedInput, ctx }) => {
      const category = await prisma.financeCategory.findUnique({
         where: { id: parsedInput.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const loan = await prisma.loan.create({
         data: {
            ...parsedInput,
            userId: ctx.userId,
         },
         include: { category: true },
      });

      updateTag("finance-loans");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-loans-savings");
      return loan;
   });

export const updateLoan = authActionClient
   .schema(
      loanSchema.extend({
         id: z.string().min(1),
      })
   )
   .action(async ({ parsedInput, ctx }) => {
      const { id, ...data } = parsedInput;

      const loan = await prisma.loan.findUnique({
         where: { id },
      });

      if (!loan || loan.userId !== ctx.userId) {
         throw new Error("Loan not found");
      }

      const category = await prisma.financeCategory.findUnique({
         where: { id: data.categoryId },
      });

      if (!category || category.userId !== ctx.userId) {
         throw new Error("Category not found");
      }

      const updated = await prisma.loan.update({
         where: { id },
         data,
         include: { category: true },
      });

      updateTag("finance-loans");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-loans-savings");
      return updated;
   });

export const deleteLoan = authActionClient
   .schema(z.object({ id: z.string().min(1) }))
   .action(async ({ parsedInput, ctx }) => {
      const loan = await prisma.loan.findUnique({
         where: { id: parsedInput.id },
      });

      if (!loan || loan.userId !== ctx.userId) {
         throw new Error("Loan not found");
      }

      await prisma.loan.delete({
         where: { id: parsedInput.id },
      });

      updateTag("finance-loans");
      updateTag("dashboard-stats");
      updateTag("dashboard-chart");
      updateTag("dashboard-loans-savings");
   });
