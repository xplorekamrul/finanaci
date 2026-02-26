"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingNav() {
   return (
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex gap-x-2 items-center">
               Financi 
               <img src="/Financilogo.jpg" alt="Financilogo.jpg" className="rounded-xl w-12 h-12" />
            </div>
            <div className="flex items-center gap-3">
               <ThemeToggle />
               <Button asChild variant="ghost">
                  <Link href="/login">Sign in</Link>
               </Button>
               <Button asChild>
                  <Link href="/register">Get Started</Link>
               </Button>
            </div>
         </div>
      </nav>
   );
}
