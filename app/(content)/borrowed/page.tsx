import { getBorrowed } from "@/actions/finance/borrowed";
import { getFinanceCategories } from "@/actions/finance/categories";
import BorrowedContent from "@/components/finance/BorrowedContent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function BorrowedData() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const borrowedResult = await getBorrowed();
   const categoriesResult = await getFinanceCategories();

   const borrowed = borrowedResult.data || [];
   const categories = categoriesResult.data || [];

   return <BorrowedContent initialBorrowed={borrowed} categories={categories} />;
}

export default function BorrowedPage() {
   return (
      <main className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header - Server Side */}
            <div className="space-y-2">
               <h1 className="text-4xl font-bold text-foreground">Borrowed Money</h1>
               <p className="text-lg text-muted-foreground">
                  Track money you borrowed from others
               </p>
            </div>

            {/* Client Component for Interactivity - Wrapped in Suspense */}
            <Suspense fallback={<BorrowedPageSkeleton />}>
               <BorrowedData />
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
