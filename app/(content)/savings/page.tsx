import { getAllFinanceCategories } from "@/actions/finance/categories";
import { getSavings } from "@/actions/finance/savings";
import SavingsContent from "@/components/finance/SavingsContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function SavingsData({ page }: { page: number }) {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getAllFinanceCategories();
   const savingsResult = await getSavings({ page });

   const categories = (categoriesResult.data as any) || [];
   const savings = (savingsResult.data as any)?.data || [];
   const pagination = (savingsResult.data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

   return (
      <SavingsContent
         initialCategories={categories}
         initialSavings={savings}
         initialPagination={pagination}
      />
   );
}

export default async function SavingsPage({
   searchParams,
}: {
   searchParams: Promise<{ page?: string }>;
}) {
   const params = await searchParams;
   const page = parseInt(params.page || "1");

   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
          

            <Suspense fallback={<SavingsPageSkeleton />}>
               <SavingsData page={page} />
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
