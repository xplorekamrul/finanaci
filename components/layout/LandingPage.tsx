"use client";

import { LandingNav } from "@/components/layout/LandingNav";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export function LandingPage() {
   return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
         {/* Navigation */}
         <LandingNav />

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
                     © 2024 Financi.Rareviewit.com. All rights reserved.
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
