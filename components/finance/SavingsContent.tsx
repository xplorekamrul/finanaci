"use client";

import { getFilteredSavings, getSavings, getSavingsSums } from "@/actions/finance/savings";
import { Pagination } from "@/components/shared/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { FinanceCategory, Savings } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import SavingsFilters from "./SavingsFilters";
import SavingsForm from "./SavingsForm";
import SavingsTable from "./SavingsTable";

interface DateRange {
   startDate: Date | null;
   endDate: Date | null;
   label: string;
}

interface SavingsContentProps {
   initialCategories: FinanceCategory[];
   initialSavings: (Savings & { category: FinanceCategory | null })[];
   initialPagination: PaginatedResponse<any>["pagination"];
}

export default function SavingsContent({
   initialCategories,
   initialSavings,
   initialPagination,
}: SavingsContentProps) {
   const [savings, setSavings] = useState<(Savings & { category: FinanceCategory | null })[]>(
      initialSavings
   );
   const [pagination, setPagination] = useState(initialPagination);
   const [editingSavings, setEditingSavings] = useState<
      (Savings & { category: FinanceCategory | null }) | null
   >(null);
   const [showModal, setShowModal] = useState(false);
   const [totalAmount, setTotalAmount] = useState<number>(0);
   const [filters, setFilters] = useState<{
      dateRange: DateRange | null;
      categoryId: string | null;
   }>({
      dateRange: null,
      categoryId: null,
   });

   const loadSavings = useCallback(
      async (
         page: number = 1,
         filtersOverride?: {
            dateRange: DateRange | null;
            categoryId: string | null;
         }
      ) => {
         try {
            // Use provided filters or fall back to state filters
            const activeFilters = filtersOverride || filters;

            // If filters are active, use filtered action
            if (activeFilters.dateRange || activeFilters.categoryId) {
               const [savingsResult, sumsResult] = await Promise.all([
                  getFilteredSavings({
                     page,
                     startDate: activeFilters.dateRange?.startDate || undefined,
                     endDate: activeFilters.dateRange?.endDate || undefined,
                     categoryId: activeFilters.categoryId || undefined,
                  }),
                  getSavingsSums({
                     startDate: activeFilters.dateRange?.startDate || undefined,
                     endDate: activeFilters.dateRange?.endDate || undefined,
                     categoryId: activeFilters.categoryId || undefined,
                  }),
               ]);

               if (savingsResult.data) {
                  const paginatedData = savingsResult.data as any;
                  setSavings(paginatedData.data || []);
                  setPagination(paginatedData.pagination || {
                     page: 1,
                     limit: 20,
                     total: 0,
                     totalPages: 0,
                     hasNextPage: false,
                     hasPrevPage: false,
                  });
               }

               if (sumsResult.data) {
                  setTotalAmount((sumsResult.data as any).total);
               }
            } else {
               // Otherwise use regular action
               const result = await getSavings({ page });
               if (result.data) {
                  const paginatedData = result.data as any;
                  setSavings(paginatedData.data || []);
                  setPagination(paginatedData.pagination || {
                     page: 1,
                     limit: 20,
                     total: 0,
                     totalPages: 0,
                     hasNextPage: false,
                     hasPrevPage: false,
                  });
               }

               // Get sums for all savings
               const sumsResult = await getSavingsSums({});
               if (sumsResult.data) {
                  setTotalAmount((sumsResult.data as any).total);
               }
            }
         } catch (error) {
            console.error("Failed to load savings:", error);
         }
      },
      [filters]
   );

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingSavings(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      loadSavings(1);
   };

   const handleFilterChange = (newFilters: {
      dateRange: DateRange | null;
      categoryId: string | null;
   }) => {
      setFilters(newFilters);
      // Pass newFilters directly to avoid stale state
      loadSavings(1, newFilters);
   };

   // Initialize total amount on component mount
   useEffect(() => {
      const initializeTotalAmount = async () => {
         try {
            const sumsResult = await getSavingsSums({});
            if (sumsResult.data) {
               setTotalAmount((sumsResult.data as any).total);
            }
         } catch (error) {
            console.error("Failed to load savings total:", error);
         }
      };

      initializeTotalAmount();
   }, []);

   return (
      <div className="space-y-2">
         {/* Header with Add Button */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-foreground">Bank Savings</h2>
               <p className="text-sm text-muted-foreground">Track your bank savings and deposits</p>
            </div>
            <button
               onClick={() => {
                  setEditingSavings(null);
                  setShowModal(true);
               }}
               disabled={initialCategories.length === 0}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Plus className="h-4 w-4" />
            </button>
         </div>

         {/* Filters */}
         <SavingsFilters
            categories={initialCategories}
            onFilterChange={handleFilterChange}
         />

         {/* Savings Total */}
         <div className="flex justify-center md:mx-5">
            <div className="flex gap-x-2">
               <p className="text-sm md:text-2xl text-muted-foreground ">Total Savings:</p>
               <p className="text-sm md:text-2xl font-bold text-blue-600">
                  +{totalAmount.toFixed(2)}
               </p>
            </div>
         </div>

         {/* Warning if no categories */}
         {initialCategories.length === 0 && (
            <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
               <p className="text-sm text-muted-foreground">
                  Create a category first before adding savings.
               </p>
            </div>
         )}

         {/* Savings Table */}
         <SavingsTable
            savings={savings}
            onEdit={(saving) => {
               setEditingSavings(saving);
               setShowModal(true);
            }}
            onRefresh={() => loadSavings(pagination.page)}
         />

         {/* Pagination */}
         <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
         />

         {/* Modal for Create/Edit */}
         <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            title={editingSavings ? "Edit Savings" : "Add Savings"}
         >
            <SavingsForm
               categories={initialCategories}
               initialData={editingSavings}
               onClose={handleCloseModal}
               onSuccess={handleSuccess}
            />
         </Modal>
      </div>
   );
}
