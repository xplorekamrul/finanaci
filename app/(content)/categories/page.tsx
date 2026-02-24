import { getFinanceCategories } from "@/actions/finance/categories";
import CategoriesContent from "@/components/finance/CategoriesContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function CategoriesData() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const categoriesResult = await getFinanceCategories();
   const categories = categoriesResult.data || [];

   return <CategoriesContent initialCategories={categories} />;
}

export default function CategoriesPage() {
   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header - Server Side */}
            <div className="space-y-2">
               <h1 className="text-4xl font-bold text-foreground">Finance Categories</h1>
               <p className="text-lg text-muted-foreground">
                  Manage your finance categories for better organization
               </p>
            </div>

            {/* Client Component for Interactivity - Wrapped in Suspense */}
            <Suspense fallback={<CategoriesPageSkeleton />}>
               <CategoriesData />
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
