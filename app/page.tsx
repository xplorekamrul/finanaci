import { getDashboardBorrowed, getDashboardChartData, getDashboardLoansAndSavings, getDashboardStats, getDashboardTopCategories } from "@/actions/finance/dashboard";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
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

function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            RareviewIt
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                Master Your <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Finances</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track income, expenses, savings, and loans all in one place. Get real-time insights into your financial health with beautiful charts and analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background flex items-center justify-center text-white text-sm font-semibold"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Join thousands managing their finances smarter
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="h-2 w-24 bg-muted rounded-full" />
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded-lg" />
                    ))}
                  </div>
                </div>

                <div className="h-40 bg-muted rounded-lg" />

                <div className="grid grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to manage your finances effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Track Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Easily log income and expenses with categories for better organization
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Visual Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful charts and graphs to visualize your spending patterns
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Savings & Loans</h3>
              <p className="text-sm text-muted-foreground">
                Track bank savings and loans given to manage your wealth
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Borrowed Money</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of money borrowed with interest and return dates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 sm:p-16 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Ready to Take Control?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start managing your finances smarter today. Sign up for free and get instant access to all features.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/register">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 RareviewIt. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
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
