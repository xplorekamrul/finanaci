"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
   page: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export function Pagination({
   page,
   totalPages,
   hasNextPage,
   hasPrevPage,
}: PaginationProps) {
   const router = useRouter();
   const searchParams = useSearchParams();

   const handlePageChange = (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`);
   };

   if (totalPages <= 1) return null;

   return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-muted rounded-lg">
         {/* Mobile: Compact view */}
         <div className="sm:hidden flex items-center gap-2 w-full justify-between">
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(page - 1)}
               disabled={!hasPrevPage}
               className="flex-1"
            >
               <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
               {page} / {totalPages}
            </span>
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(page + 1)}
               disabled={!hasNextPage}
               className="flex-1"
            >
               <ChevronRight className="w-4 h-4" />
            </Button>
         </div>

         {/* Desktop: Full view */}
         <div className="hidden sm:flex items-center gap-2">
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(1)}
               disabled={!hasPrevPage}
            >
               First
            </Button>
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(page - 1)}
               disabled={!hasPrevPage}
            >
               <ChevronLeft className="w-4 h-4" />
            </Button>
         </div>

         <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium">
               Page <span className="font-bold">{page}</span> of{" "}
               <span className="font-bold">{totalPages}</span>
            </span>
         </div>

         <div className="hidden sm:flex items-center gap-2">
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(page + 1)}
               disabled={!hasNextPage}
            >
               <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(totalPages)}
               disabled={!hasNextPage}
            >
               Last
            </Button>
         </div>
      </div>
   );
}
