import { getFinanceCategories } from "@/actions/finance/categories";
import CategoriesContent from "@/components/finance/CategoriesContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function CategoriesData({ page }: { page: number }) {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getFinanceCategories({ page });
   const categories = (categoriesResult.data as any)?.data || [];
   const pagination = (categoriesResult.data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

   return <CategoriesContent initialCategories={categories} initialPagination={pagination} />;
}

export default async function CategoriesPage({
   searchParams,
}: {
   searchParams: Promise<{ page?: string }>;
}) {
   const params = await searchParams;
   const page = parseInt(params.page || "1");

   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
           

            <Suspense fallback={<CategoriesPageSkeleton />}>
               <CategoriesData page={page} />
            </Suspense>
         </div>
      </main>
   );
}

function CategoriesPageSkeleton() {
   return (
      <div className="space-y-6">
         <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
         <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
   );
}
