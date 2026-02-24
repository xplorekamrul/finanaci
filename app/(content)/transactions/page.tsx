import { getFinanceCategories } from "@/actions/finance/categories";
import { getTransactions } from "@/actions/finance/transactions";
import TransactionsContent from "@/components/finance/TransactionsContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function TransactionsData() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getFinanceCategories();
   const transactionsResult = await getTransactions();

   const categories = categoriesResult.data || [];
   const transactions = transactionsResult.data || [];

   return <TransactionsContent initialCategories={categories} initialTransactions={transactions} />;
}

export default function TransactionsPage() {
   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header - Server Side */}
            <div className="space-y-2">
               <h1 className="text-4xl font-bold text-foreground">Transactions</h1>
               <p className="text-lg text-muted-foreground">
                  Track your income and expenses with detailed transactions
               </p>
            </div>

            {/* Client Component for Interactivity - Wrapped in Suspense */}
            <Suspense fallback={<TransactionsPageSkeleton />}>
               <TransactionsData />
            </Suspense>
         </div>
      </main>
   );
}

function TransactionsPageSkeleton() {
   return (
      <div className="space-y-6">
         <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
         <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
   );
}
