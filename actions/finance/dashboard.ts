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
   cacheLife("minutes");
   cacheTag("dashboard-stats");

   const { startDate: dayStart, endDate: dayEnd } = getDateRange("day");
   const { startDate: weekStart } = getDateRange("week");
   const { startDate: monthStart } = getDateRange("month");
   const { startDate: yearStart } = getDateRange("year");

   // Fetch all transactions with date filtering at DB level
   const [dayTransactions, weekTransactions, monthTransactions, yearTransactions] = await Promise.all([
      prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: { gte: dayStart, lte: dayEnd },
         },
         select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: { gte: weekStart, lte: dayEnd },
         },
         select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: { gte: monthStart, lte: dayEnd },
         },
         select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
         where: {
            userId: ctx.userId,
            deletedAt: null,
            date: { gte: yearStart, lte: dayEnd },
         },
         select: { type: true, amount: true },
      }),
   ]);

   const calculateStats = (transactions: typeof dayTransactions) => {
      const income = transactions
         .filter((t) => t.type === "INCOME")
         .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
         .filter((t) => t.type === "EXPENSE")
         .reduce((sum, t) => sum + t.amount, 0);

      return { income, expense, balance: income - expense };
   };

   return {
      day: calculateStats(dayTransactions),
      week: calculateStats(weekTransactions),
      month: calculateStats(monthTransactions),
      year: calculateStats(yearTransactions),
   };
});

export const getDashboardChartData = authActionClient.action(async ({ ctx }) => {
   "use cache";
   cacheLife("minutes");
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
   cacheLife("minutes");
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
   cacheLife("minutes");
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
   cacheLife("minutes");
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
