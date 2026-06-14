"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/clients";
import { cacheLife, cacheTag } from "next/cache";

type DateRange = "day" | "week" | "month" | "year";

function getDateRange(range: DateRange) {
   const now = new Date();
   let startDate = new Date();

   switch (range) {
      case "day":
         startDate.setHours(0, 0, 0, 0);
         break;
      case "week":
         startDate.setDate(now.getDate() - now.getDay());
         startDate.setHours(0, 0, 0, 0);
         break;
      case "month":
         startDate.setDate(1);
         startDate.setHours(0, 0, 0, 0);
         break;
      case "year":
         startDate.setMonth(0, 1);
         startDate.setHours(0, 0, 0, 0);
         break;
   }

   return { startDate, endDate: now };
}

export const getDashboardStats = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("hours");
   cacheTag("dashboard-stats");

   const now = new Date();
   const dayStart = new Date(now);
   dayStart.setHours(0, 0, 0, 0);

   const weekStart = new Date(now);
   weekStart.setDate(now.getDate() - now.getDay());
   weekStart.setHours(0, 0, 0, 0);

   const monthStart = new Date(now);
   monthStart.setDate(1);
   monthStart.setHours(0, 0, 0, 0);

   const yearStart = new Date(now);
   yearStart.setMonth(0, 1);
   yearStart.setHours(0, 0, 0, 0);

   // Fetch all transactions once, then filter in memory
   const allTransactions = await prisma.transaction.findMany({
      where: {
         userId: ctx.userId,
         deletedAt: null,
         date: { gte: yearStart },
      },
      select: { type: true, amount: true, date: true },
   });

   // Get all savings, loans, and borrowed for the year
   const allSavings = await prisma.savings.findMany({
      where: {
         userId: ctx.userId,
         savingsDate: { gte: yearStart },
      },
      select: { amount: true, savingsDate: true },
   });

   const allLoans = await prisma.loan.findMany({
      where: {
         userId: ctx.userId,
         loanDate: { gte: yearStart },
      },
      select: { amount: true, loanDate: true },
   });

   const allBorrowed = await prisma.borrowed.findMany({
      where: {
         userId: ctx.userId,
         borrowDate: { gte: yearStart },
      },
      select: { amount: true, borrowDate: true },
   });

   const calculateStats = (
      transactions: typeof allTransactions,
      savings: typeof allSavings,
      loans: typeof allLoans,
      borrowed: typeof allBorrowed,
      startDate: Date
   ) => {
      const filteredTransactions = transactions.filter(t => t.date >= startDate);
      const filteredSavings = savings.filter(s => s.savingsDate >= startDate);
      const filteredLoans = loans.filter(l => l.loanDate >= startDate);
      const filteredBorrowed = borrowed.filter(b => b.borrowDate >= startDate);

      const income = filteredTransactions
         .filter((t) => t.type === "INCOME")
         .reduce((sum, t) => sum + t.amount, 0);

      const expense = filteredTransactions
         .filter((t) => t.type === "EXPENSE")
         .reduce((sum, t) => sum + t.amount, 0);

      const totalSavings = filteredSavings.reduce((sum, s) => sum + s.amount, 0);
      const totalLoans = filteredLoans.reduce((sum, l) => sum + l.amount, 0);
      const totalBorrowed = filteredBorrowed.reduce((sum, b) => sum + b.amount, 0);

      // Balance = Income - Expense - Savings - Loans - Borrowed
      const balance = income - expense - totalSavings - totalLoans - totalBorrowed;

      return { income, expense, balance };
   };

   return {
      day: calculateStats(allTransactions, allSavings, allLoans, allBorrowed, dayStart),
      week: calculateStats(allTransactions, allSavings, allLoans, allBorrowed, weekStart),
      month: calculateStats(allTransactions, allSavings, allLoans, allBorrowed, monthStart),
      year: calculateStats(allTransactions, allSavings, allLoans, allBorrowed, yearStart),
   };
});

export const getDashboardChartData = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("hours");
   cacheTag("dashboard-chart");

   const { startDate: monthStart } = getDateRange("month");

   const transactions = await prisma.transaction.findMany({
      where: {
         userId: ctx.userId,
         deletedAt: null,
         date: {
            gte: monthStart,
         },
      },
      select: {
         date: true,
         type: true,
         amount: true,
         categoryId: true,
         category: {
            select: { name: true, icon: true },
         },
      },
   });

   const dailyData: Record<string, { income: number; expense: number }> = {};
   const categoryData: Record<
      string,
      { name: string; income: number; expense: number; icon: string | null }
   > = {};

   transactions.forEach((t) => {
      const dateKey = t.date.toISOString().split("T")[0];
      if (!dailyData[dateKey]) {
         dailyData[dateKey] = { income: 0, expense: 0 };
      }

      if (t.type === "INCOME") {
         dailyData[dateKey].income += t.amount;
      } else {
         dailyData[dateKey].expense += t.amount;
      }

      const catKey = t.categoryId;
      if (!categoryData[catKey]) {
         categoryData[catKey] = {
            name: t.category.name,
            income: 0,
            expense: 0,
            icon: t.category.icon,
         };
      }

      if (t.type === "INCOME") {
         categoryData[catKey].income += t.amount;
      } else {
         categoryData[catKey].expense += t.amount;
      }
   });

   return {
      daily: Object.entries(dailyData)
         .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
         .map(([date, data]) => ({
            date,
            ...data,
         })),
      category: Object.values(categoryData),
   };
});

export const getDashboardTopCategories = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("hours");
   cacheTag("dashboard-categories");

   const { startDate: monthStart } = getDateRange("month");

   // Get top categories with aggregated amounts
   const topCategories = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
         userId: ctx.userId,
         deletedAt: null,
         date: {
            gte: monthStart,
         },
      },
      _sum: {
         amount: true,
      },
      _count: true,
      orderBy: {
         _sum: {
            amount: "desc",
         },
      },
      take: 5,
   });

   // Batch fetch all categories in one query instead of N+1
   const categoryIds = topCategories.map((item) => item.categoryId);
   const categories = await prisma.financeCategory.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true },
   });

   const categoryMap = new Map(categories.map((c) => [c.id, c]));

   const categoriesWithDetails = topCategories.map((item) => {
      const category = categoryMap.get(item.categoryId);
      return {
         id: item.categoryId,
         name: category?.name || "Unknown",
         icon: category?.icon,
         amount: item._sum.amount || 0,
         count: item._count,
      };
   });

   return categoriesWithDetails;
});

export const getDashboardLoansAndSavings = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("hours");
   cacheTag("dashboard-loans-savings");

   const { startDate: monthStart } = getDateRange("month");

   const loans = await prisma.loan.findMany({
      where: {
         userId: ctx.userId,
         loanDate: {
            gte: monthStart,
         },
      },
      include: { category: true },
      orderBy: { loanDate: "desc" },
      take: 5,
   });

   const savings = await prisma.savings.findMany({
      where: {
         userId: ctx.userId,
         savingsDate: {
            gte: monthStart,
         },
      },
      include: { category: true },
      orderBy: { savingsDate: "desc" },
      take: 5,
   });

   const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);
   const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0);

   return {
      loans,
      savings,
      totalLoans,
      totalSavings,
   };
});

export const getDashboardBorrowed = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("hours");
   cacheTag("dashboard-borrowed");

   const { startDate: monthStart } = getDateRange("month");

   const borrowed = await prisma.borrowed.findMany({
      where: {
         userId: ctx.userId,
         borrowDate: {
            gte: monthStart,
         },
      },
      include: { category: true },
      orderBy: { borrowDate: "desc" },
      take: 5,
   });

   const totalBorrowed = borrowed.reduce((sum, item) => sum + item.amount, 0);
   const totalInterest = borrowed.reduce((sum, item) => sum + (item.interest || 0), 0);

   return {
      borrowed,
      totalBorrowed,
      totalInterest,
   };
});

// Custom date range actions
import * as z from "zod";

const dateRangeSchema = z.object({
   startDate: z.date(),
   endDate: z.date(),
});

export const getDashboardChartDataByDateRange = authActionClient
   .schema(dateRangeSchema)
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("dashboard-chart-custom");

      const { startDate, endDate } = parsedInput;

      const transactions = await prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: {
               gte: startDate,
               lte: endDate,
            },
         },
         select: {
            date: true,
            type: true,
            amount: true,
            categoryId: true,
            category: {
               select: { name: true, icon: true },
            },
         },
      });

      const dailyData: Record<string, { income: number; expense: number }> = {};
      const categoryData: Record<
         string,
         { name: string; income: number; expense: number; icon: string | null }
      > = {};

      transactions.forEach((t) => {
         const dateKey = t.date.toISOString().split("T")[0];
         if (!dailyData[dateKey]) {
            dailyData[dateKey] = { income: 0, expense: 0 };
         }

         if (t.type === "INCOME") {
            dailyData[dateKey].income += t.amount;
         } else {
            dailyData[dateKey].expense += t.amount;
         }

         const catKey = t.categoryId;
         if (!categoryData[catKey]) {
            categoryData[catKey] = {
               name: t.category.name,
               income: 0,
               expense: 0,
               icon: t.category.icon,
            };
         }

         if (t.type === "INCOME") {
            categoryData[catKey].income += t.amount;
         } else {
            categoryData[catKey].expense += t.amount;
         }
      });

      return {
         daily: Object.entries(dailyData)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, data]) => ({
               date,
               ...data,
            })),
         category: Object.values(categoryData),
      };
   });

export const getDashboardStatsByDateRange = authActionClient
   .schema(dateRangeSchema)
   .action(async ({ ctx, parsedInput }) => {
      "use cache";
      cacheLife("minutes");
      cacheTag("dashboard-stats-custom");

      const { startDate, endDate } = parsedInput;

      const transactions = await prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: { gte: startDate, lte: endDate },
         },
         select: { type: true, amount: true },
      });

      const savings = await prisma.savings.findMany({
         where: {
            userId: ctx.userId,
            savingsDate: { gte: startDate, lte: endDate },
         },
         select: { amount: true },
      });

      const loans = await prisma.loan.findMany({
         where: {
            userId: ctx.userId,
            loanDate: { gte: startDate, lte: endDate },
         },
         select: { amount: true },
      });

      const borrowed = await prisma.borrowed.findMany({
         where: {
            userId: ctx.userId,
            borrowDate: { gte: startDate, lte: endDate },
         },
         select: { amount: true },
      });

      const income = transactions
         .filter((t) => t.type === "INCOME")
         .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
         .filter((t) => t.type === "EXPENSE")
         .reduce((sum, t) => sum + t.amount, 0);

      const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
      const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
      const totalBorrowed = borrowed.reduce((sum, b) => sum + b.amount, 0);

      // Balance = Income - Expense - Savings - Loans - Borrowed
      const balance = income - expense - totalSavings - totalLoans - totalBorrowed;

      return {
         income,
         expense,
         balance,
      };
   });
