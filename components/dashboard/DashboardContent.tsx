"use client";

import { getDashboardChartDataByDateRange, getDashboardStatsByDateRange } from "@/actions/finance/dashboard";
import CategoryChart from "@/components/dashboard/CategoryChart";
import IncomeExpenseByDateChart from "@/components/dashboard/IncomeExpenseByDateChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import LoansAndSavingsCard from "@/components/dashboard/LoansAndSavingsCard";
import StatsCard from "@/components/dashboard/StatsCard";
import TopCategoriesTable from "@/components/dashboard/TopCategoriesTable";
import DateRangePicker from "@/components/shared/DateRangePicker";
import { Borrowed, FinanceCategory, Loan, Savings } from "@prisma/client";
import { AlertCircle, Banknote, DollarSign, HandshakeIcon, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type DateRange = "day" | "week" | "month" | "year";

interface DateRangeType {
   startDate: Date | null;
   endDate: Date | null;
   label: string;
}

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
   const [customDateRange, setCustomDateRange] = useState<DateRangeType | null>(null);
   const [customStats, setCustomStats] = useState<{ income: number; expense: number; balance: number } | null>(null);
   const [customChartData, setCustomChartData] = useState<{ daily: Array<{ date: string; income: number; expense: number }>; category: Array<{ name: string; income: number; expense: number; icon: string | null }> } | null>(null);
   const [isLoadingCustom, setIsLoadingCustom] = useState(false);

   // Get default date range (current month)
   useEffect(() => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const defaultRange: DateRangeType = {
         startDate: startOfMonth,
         endDate: today,
         label: "This Month",
      };
      setCustomDateRange(defaultRange);
      // Automatically load data for this month
      handleDateRangeChange(defaultRange);
   }, []);// Get default date range (current month)
   useEffect(() => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const defaultRange: DateRangeType = {
         startDate: startOfMonth,
         endDate: today,
         label: "This Month",
      };
      setCustomDateRange(defaultRange);
      // Automatically load data for this month
      handleDateRangeChange(defaultRange);
   }, []);

   const handleDateRangeChange = async (range: DateRangeType) => {
      setCustomDateRange(range);

      if (!range.startDate || !range.endDate) {
         setCustomStats(null);
         setCustomChartData(null);
         return;
      }

      setIsLoadingCustom(true);
      try {
         const [statsResult, chartResult] = await Promise.all([
            getDashboardStatsByDateRange({
               startDate: range.startDate,
               endDate: range.endDate,
            }),
            getDashboardChartDataByDateRange({
               startDate: range.startDate,
               endDate: range.endDate,
            }),
         ]);

         if (statsResult.data) {
            setCustomStats(statsResult.data);
         }
         if (chartResult.data) {
            setCustomChartData(chartResult.data);
         }
      } catch (error) {
         console.error("Failed to fetch custom date range data:", error);
      } finally {
         setIsLoadingCustom(false);
      }
   };

   const currentStats = customStats || stats?.[dateRange] || { income: 0, expense: 0, balance: 0 };
   const currentChartData = customChartData || chartData;

   return (
      <div className="space-y-8">
         {/* Date Range Filter */}
         <div className="space-y-4">
            <div>
               <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Date Range
               </label>
               <div className="w-full md:w-96">
                  <DateRangePicker
                     onRangeChange={handleDateRangeChange}
                     defaultRange={customDateRange || undefined}
                  />
               </div>
            </div>
         </div>

         {isLoadingCustom && (
            <div className="flex items-center justify-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
         )}

         {!isLoadingCustom && (
            <>
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
                     amount={currentStats.income > 0 ? ((currentStats.balance / currentStats.income) * 100).toFixed(1) : 0}
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
                     amount={currentStats.balance - (borrowed?.totalBorrowed || 0)}
                     icon={<DollarSign className="h-6 w-6" />}
                     color={(currentStats.balance - (borrowed?.totalBorrowed || 0)) >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}
                     bgColor={(currentStats.balance - (borrowed?.totalBorrowed || 0)) >= 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-red-100 dark:bg-red-900/30"}
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

               {/* Charts - Both Old and New */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Old Area Chart */}
                  <div className="lg:col-span-2">
                     <IncomeExpenseChart data={currentChartData?.daily || []} />
                  </div>

                  {/* Category Distribution */}
                  <div>
                     <CategoryChart data={currentChartData?.category || []} />
                  </div>
               </div>

               {/* New Bar Chart */}
               <div>
                  <IncomeExpenseByDateChart data={currentChartData?.daily || []} />
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
            </>
         )}
      </div>
   );
}
