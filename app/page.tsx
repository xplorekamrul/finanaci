import { getDashboardBorrowed, getDashboardChartData, getDashboardLoansAndSavings, getDashboardStats, getDashboardTopCategories } from "@/actions/finance/dashboard";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { LandingPage } from "@/components/layout/LandingPage";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

async function DashboardData() {
  const statsResult = await getDashboardStats();
  const chartResult = await getDashboardChartData();
  const categoriesResult = await getDashboardTopCategories();
  const loansAndSavingsResult = await getDashboardLoansAndSavings();
  const borrowedResult = await getDashboardBorrowed();

  return (
    <DashboardContent
      stats={statsResult.data || {
        day: { income: 0, expense: 0, balance: 0 },
        week: { income: 0, expense: 0, balance: 0 },
        month: { income: 0, expense: 0, balance: 0 },
        year: { income: 0, expense: 0, balance: 0 },
      }}
      chartData={chartResult.data || { daily: [], category: [] }}
      topCategories={(categoriesResult.data || []).map((cat) => ({
        ...cat,
        icon: cat.icon || null,
      }))}
      loansAndSavings={loansAndSavingsResult.data ? {
        loans: loansAndSavingsResult.data.loans as any,
        savings: loansAndSavingsResult.data.savings as any,
        totalLoans: loansAndSavingsResult.data.totalLoans,
        totalSavings: loansAndSavingsResult.data.totalSavings,
      } : {
        loans: [],
        savings: [],
        totalLoans: 0,
        totalSavings: 0,
      }}
      borrowed={borrowedResult.data ? {
        borrowed: borrowedResult.data.borrowed as any,
        totalBorrowed: borrowedResult.data.totalBorrowed,
        totalInterest: borrowedResult.data.totalInterest,
      } : {
        borrowed: [],
        totalBorrowed: 0,
        totalInterest: 0,
      }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-muted rounded-lg animate-pulse" />
        <div className="h-80 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="h-64 bg-muted rounded-lg animate-pulse" />
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Track your income and expenses at a glance
            </p>
          </div>

          {/* Content with Suspense */}
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardData />
          </Suspense>
        </div>
      </main>
    );
  }

  return <LandingPage />;
}
