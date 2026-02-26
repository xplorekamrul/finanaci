"use client";

import { getLoans } from "@/actions/finance/loans";
import { Pagination } from "@/components/shared/Pagination";
import { FinanceCategory, Loan } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import LoanForm from "./LoanForm";
import LoansTable from "./LoansTable";

interface LoansContentProps {
   initialCategories: FinanceCategory[];
   initialLoans: (Loan & { category: FinanceCategory | null })[];
   initialPagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
   };
}

export default function LoansContent({
   initialCategories,
   initialLoans,
   initialPagination,
}: LoansContentProps) {
   const [categories] = useState<FinanceCategory[]>(initialCategories);
   const [loans, setLoans] = useState<(Loan & { category: FinanceCategory | null })[]>(initialLoans);
   const [pagination, setPagination] = useState(initialPagination);
   const [showModal, setShowModal] = useState(false);
   const [editingLoan, setEditingLoan] = useState<Loan & { category: FinanceCategory | null } | null>(null);

   const handleRefresh = useCallback(async () => {
      try {
         const result = await getLoans({ page: pagination.page });
         if (result.data) {
            const paginatedData = result.data as any;
            setLoans(paginatedData.data || []);
            setPagination(paginatedData.pagination || pagination);
         }
      } catch (error) {
         console.error("Failed to load loans:", error);
      }
   }, [pagination]);

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingLoan(null);
   };

   return (
      <div className="space-y-6">
         {!showModal ? (
            <>
               <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-semibold text-foreground">Loans Given</h2>
                  <button
                     onClick={() => {
                        setEditingLoan(null);
                        setShowModal(true);
                     }}
                     disabled={categories.length === 0}
                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                     <Plus className="h-4 w-4" />
                     Add Loan
                  </button>
               </div>

               {categories.length === 0 && (
                  <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
                     <p className="text-sm text-muted-foreground">
                        Create a category first before adding loans.
                     </p>
                  </div>
               )}

               <LoansTable
                  loans={loans}
                  onEdit={(loan) => {
                     setEditingLoan(loan);
                     setShowModal(true);
                  }}
                  onRefresh={handleRefresh}
               />

               <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
               />
            </>
         ) : (
            <LoanForm
               categories={categories}
               initialData={editingLoan}
               onClose={handleCloseModal}
               onSuccess={() => {
                  handleCloseModal();
                  handleRefresh();
               }}
            />
         )}
      </div>
   );
}
