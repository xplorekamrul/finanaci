import { getAllFinanceCategories } from "@/actions/finance/categories";
import { getLoans } from "@/actions/finance/loans";
import LoansContent from "@/components/finance/LoansContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function LoansData({ page }: { page: number }) {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getAllFinanceCategories();
   const loansResult = await getLoans({ page });

   const categories = (categoriesResult.data as any) || [];
   const loans = (loansResult.data as any)?.data || [];
   const pagination = (loansResult.data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

   return (
      <LoansContent
         initialCategories={categories}
         initialLoans={loans}
         initialPagination={pagination}
      />
   );
}

export default async function LoansPage({
   searchParams,
}: {
   searchParams: Promise<{ page?: string }>;
}) {
   const params = await searchParams;
   const page = parseInt(params.page || "1");

   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">

            <Suspense fallback={<LoansPageSkeleton />}>
               <LoansData page={page} />
            </Suspense>
         </div>
      </main>
   );
}

function LoansPageSkeleton() {
   return (
      <div className="space-y-6">
         <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
         <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
   );
}
