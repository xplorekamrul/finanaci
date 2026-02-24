import { getFinanceCategories } from "@/actions/finance/categories";
import { getSavings } from "@/actions/finance/savings";
import SavingsContent from "@/components/finance/SavingsContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function SavingsData() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getFinanceCategories();
   const savingsResult = await getSavings();

   const categories = categoriesResult.data || [];
   const savings = savingsResult.data || [];

   return <SavingsContent initialCategories={categories} initialSavings={savings} />;
}

export default function SavingsPage() {
   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header - Server Side */}
            <div className="space-y-2">
               <h1 className="text-4xl font-bold text-foreground">Bank Savings</h1>
               <p className="text-lg text-muted-foreground">
                  Manage your bank savings and track your deposits
               </p>
            </div>

            {/* Client Component for Interactivity - Wrapped in Suspense */}
            <Suspense fallback={<SavingsPageSkeleton />}>
               <SavingsData />
            </Suspense>
         </div>
      </main>
   );
}

function SavingsPageSkeleton() {
   return (
      <div className="space-y-6">
         <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
         <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
   );
}
