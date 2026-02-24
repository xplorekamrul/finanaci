"use client";

import CategoryChart from "@/components/dashboard/CategoryChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import LoansAndSavingsCard from "@/components/dashboard/LoansAndSavingsCard";
import StatsCard from "@/components/dashboard/StatsCard";
import TopCategoriesTable from "@/components/dashboard/TopCategoriesTable";
import { Borrowed, FinanceCategory, Loan, Savings } from "@prisma/client";
import { AlertCircle, Banknote, DollarSign, HandshakeIcon, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

type DateRange = "day" | "week" | "month" | "year";

interface DashboardContentProps {
   stats: {
      day: { income: number; expense: number; balance: number };
      week: { income: number; expense: number; balance: number };
      month: { income: number; expense: number; balance: number };
      year: { income: number; expense: number; balance: number };
   } | null;
   chartData: {
      daily: Array<{ date: string; income: number; expense: number }>;
      category: Array<{ name: string; income: number; expense: number; icon: string | null }>;
   } | null;
   topCategories: Array<{
      id: string;
      name: string;
      icon: string | null;
      amount: number;
      count: number;
   }> | null;
   loansAndSavings: {
      loans: (Loan & { category: FinanceCategory | null })[];
      savings: (Savings & { category: FinanceCategory | null })[];
      totalLoans: number;
      totalSavings: number;
   } | null;
   borrowed: {
      borrowed: (Borrowed & { category: FinanceCategory | null })[];
      totalBorrowed: number;
      totalInterest: number;
   } | null;
}

export default function DashboardContent({
   stats,
   chartData,
   topCategories,
   loansAndSavings,
   borrowed,
}: DashboardContentProps) {
   const [dateRange, setDateRange] = useState<DateRange>("month");

   const currentStats = stats?.[dateRange] || { income: 0, expense: 0, balance: 0 };

   // Calculate adjusted balance considering borrowed money
   const adjustedBalance = currentStats.balance - (borrowed?.totalBorrowed || 0);

   // Calculate effective savings rate
   const effectiveSavingsRate = currentStats.income > 0
      ? ((adjustedBalance / currentStats.income) * 100).toFixed(1)
      : 0;

   const rangeLabels: Record<DateRange, string> = {
      day: "Today",
      week: "This Week",
      month: "This Month",
      year: "This Year",
   };

   return (
      <div className="space-y-8">
         {/* Date Range Filter */}
         <div className="flex gap-2 flex-wrap">
            {(["day", "week", "month", "year"] as DateRange[]).map((range) => (
               <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateRange === range
                     ? "bg-primary text-primary-foreground"
                     : "bg-muted text-foreground hover:bg-muted/80"
                     }`}
               >
                  {rangeLabels[range]}
               </button>
            ))}
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
               title="Income"
               amount={currentStats.income}
               icon={<TrendingUp className="h-6 w-6" />}
               color="text-green-600 dark:text-green-400"
               bgColor="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
               title="Expense"
               amount={currentStats.expense}
               icon={<TrendingDown className="h-6 w-6" />}
               color="text-red-600 dark:text-red-400"
               bgColor="bg-red-100 dark:bg-red-900/30"
            />
            <StatsCard
               title="Balance"
               amount={currentStats.balance}
               icon={<DollarSign className="h-6 w-6" />}
               color={currentStats.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}
               bgColor={currentStats.balance >= 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-red-100 dark:bg-red-900/30"}
            />
            <StatsCard
               title="Savings Rate"
               amount={effectiveSavingsRate}
               suffix="%"
               icon={<PieChart className="h-6 w-6" />}
               color="text-purple-600 dark:text-purple-400"
               bgColor="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatsCard
               title="Loans Given"
               amount={loansAndSavings?.totalLoans || 0}
               icon={<HandshakeIcon className="h-6 w-6" />}
               color="text-orange-600 dark:text-orange-400"
               bgColor="bg-orange-100 dark:bg-orange-900/30"
            />
            <StatsCard
               title="Bank Savings"
               amount={loansAndSavings?.totalSavings || 0}
               icon={<Banknote className="h-6 w-6" />}
               color="text-cyan-600 dark:text-cyan-400"
               bgColor="bg-cyan-100 dark:bg-cyan-900/30"
            />
            <StatsCard
               title="Money Borrowed"
               amount={borrowed?.totalBorrowed || 0}
               icon={<AlertCircle className="h-6 w-6" />}
               color="text-red-600 dark:text-red-400"
               bgColor="bg-red-100 dark:bg-red-900/30"
            />
            <StatsCard
               title="Adjusted Balance"
               amount={adjustedBalance}
               icon={<DollarSign className="h-6 w-6" />}
               color={adjustedBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}
               bgColor={adjustedBalance >= 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-red-100 dark:bg-red-900/30"}
            />
            {borrowed && borrowed.totalInterest > 0 && (
               <StatsCard
                  title="Total Interest"
                  amount={borrowed.totalInterest}
                  suffix="%"
                  icon={<TrendingDown className="h-6 w-6" />}
                  color="text-amber-600 dark:text-amber-400"
                  bgColor="bg-amber-100 dark:bg-amber-900/30"
               />
            )}
         </div>

         {/* Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Income vs Expense Chart */}
            <div className="lg:col-span-2">
               <IncomeExpenseChart data={chartData?.daily || []} />
            </div>

            {/* Category Distribution */}
            <div>
               <CategoryChart data={chartData?.category || []} />
            </div>
         </div>

         {/* Top Categories */}
         <TopCategoriesTable categories={topCategories || []} />

         {/* Loans and Savings */}
         {loansAndSavings && (
            <LoansAndSavingsCard
               loans={loansAndSavings.loans}
               savings={loansAndSavings.savings}
               totalLoans={loansAndSavings.totalLoans}
               totalSavings={loansAndSavings.totalSavings}
            />
         )}
      </div>
   );
}
