"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { loanSchema } from "@/lib/validations/loans";
import { updateTag } from "next/cache";
import * as z from "zod";

export const getLoans = authActionClient.action(async ({ ctx }) => {
   const loans = await prisma.loan.findMany({
      where: {
         userId: ctx.userId,
      },
      include: { category: true },
      orderBy: { loanDate: "desc" },
   });
   return loans;
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
   });
