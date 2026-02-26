import { getBorrowed } from "@/actions/finance/borrowed";
import { getAllFinanceCategories } from "@/actions/finance/categories";
import BorrowedContent from "@/components/finance/BorrowedContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function BorrowedData({ page }: { page: number }) {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const borrowedResult = await getBorrowed({ page });
   const categoriesResult = await getAllFinanceCategories();

   const borrowed = (borrowedResult.data as any)?.data || [];
   const categories = (categoriesResult.data as any) || [];
   const pagination = (borrowedResult.data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

   return (
      <BorrowedContent
         initialBorrowed={borrowed}
         categories={categories}
         initialPagination={pagination}
      />
   );
}

export default async function BorrowedPage({
   searchParams,
}: {
   searchParams: Promise<{ page?: string }>;
}) {
   const params = await searchParams;
   const page = parseInt(params.page || "1");

   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            

            <Suspense fallback={<BorrowedPageSkeleton />}>
               <BorrowedData page={page} />
            </Suspense>
         </div>
      </main>
   );
}

function BorrowedPageSkeleton() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
         </div>
         <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
   );
}
