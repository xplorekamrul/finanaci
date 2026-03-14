"use client";

import { getFilteredTransactions, getTransactions, getTransactionSums } from "@/actions/finance/transactions";
import { Pagination } from "@/components/shared/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { FinanceCategory, Transaction } from "@prisma/client";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import TransactionFilters from "./TransactionFilters";
import TransactionForm from "./TransactionForm";
import TransactionsTable from "./TransactionsTable";

interface DateRange {
   startDate: Date | null;
   endDate: Date | null;
   label: string;
}

interface TransactionsContentProps {
   initialCategories: FinanceCategory[];
   initialTransactions: (Transaction & { category: FinanceCategory })[];
   initialPagination: PaginatedResponse<any>["pagination"];
}

export default function TransactionsContent({
   initialCategories,
   initialTransactions,
   initialPagination,
}: TransactionsContentProps) {
   const searchParams = useSearchParams();
   const [transactions, setTransactions] = useState<(Transaction & { category: FinanceCategory })[]>(
      initialTransactions
   );
   const [pagination, setPagination] = useState(initialPagination);
   const [editingTransaction, setEditingTransaction] = useState<
      (Transaction & { category: FinanceCategory }) | null
   >(null);
   const [showModal, setShowModal] = useState(false);
   const [sums, setSums] = useState<{ income: number; expense: number; total: number }>({
      income: 0,
      expense: 0,
      total: 0,
   });
   const [filters, setFilters] = useState<{
      dateRange: DateRange | null;
      categoryId: string | null;
      type: string | null;
   }>({
      dateRange: null,
      categoryId: null,
      type: null,
   });

   const loadTransactions = useCallback(async (page: number = 1) => {
      try {
         // If filters are active, use filtered action
         if (filters.dateRange || filters.categoryId || filters.type) {
            const [transResult, sumsResult] = await Promise.all([
               getFilteredTransactions({
                  page,
                  startDate: filters.dateRange?.startDate || undefined,
                  endDate: filters.dateRange?.endDate || undefined,
                  categoryId: filters.categoryId || undefined,
                  type: (filters.type as "INCOME" | "EXPENSE") || undefined,
               }),
               getTransactionSums({
                  startDate: filters.dateRange?.startDate || undefined,
                  endDate: filters.dateRange?.endDate || undefined,
                  categoryId: filters.categoryId || undefined,
                  type: (filters.type as "INCOME" | "EXPENSE") || undefined,
               }),
            ]);

            if (transResult.data) {
               const paginatedData = transResult.data as any;
               setTransactions(paginatedData.data || []);
               setPagination(paginatedData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
            }

            if (sumsResult.data) {
               setSums(sumsResult.data as any);
            }
         } else {
            // Otherwise use regular action
            const result = await getTransactions({ page });
            if (result.data) {
               const paginatedData = result.data as any;
               setTransactions(paginatedData.data || []);
               setPagination(paginatedData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
            }

            // Get sums for all transactions
            const sumsResult = await getTransactionSums({});
            if (sumsResult.data) {
               setSums(sumsResult.data as any);
            }
         }
      } catch (error) {
         console.error("Failed to load transactions:", error);
      }
   }, [filters]);

   // Load transactions when page changes via URL
   useEffect(() => {
      const page = parseInt(searchParams.get("page") || "1");
      loadTransactions(page);
   }, [searchParams, loadTransactions]);

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingTransaction(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      loadTransactions(1);
   };

   const handleFilterChange = (newFilters: {
      dateRange: DateRange | null;
      categoryId: string | null;
      type: string | null;
   }) => {
      setFilters(newFilters);
      // Reset to page 1 when filters change
      loadTransactions(1);
   };

   return (
      <div className="space-y-3 md:space-y-6">
         {/* Header with Add Button */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
               <p className="text-sm text-muted-foreground">Track your income and expenses</p>
            </div>
            <button
               onClick={() => {
                  setEditingTransaction(null);
                  setShowModal(true);
               }}
               disabled={initialCategories.length === 0}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Plus className="h-4 w-4" />
            </button>
         </div>

         {/* Filters */}
         <TransactionFilters
            categories={initialCategories}
            onFilterChange={handleFilterChange}
         />

         {/* Transaction Sums */}
         <div className="flex justify-between flex-wrap gap-x-2 md:mx-5 ">
            {/* Income Card */}
            <div className="flex gap-x-1 ">
               <p className="text-sm md:text-2xl text-muted-foreground mb-1">Income:</p>
               <p className="text-sm md:text-2xl font-bold text-green-600">
                  +{sums.income.toFixed(2)}
               </p>
            </div>

            {/* Expense Card */}
            <div className="flex gap-x-1">
               <p className="text-sm md:text-2xl text-muted-foreground mb-1">Expense:</p>
               <p className="text-sm md:text-3xl font-bold text-red-600">
                  -{sums.expense.toFixed(2)}
               </p>
            </div>
         </div>

         {/* Warning if no categories */}
         {initialCategories.length === 0 && (
            <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
               <p className="text-sm text-muted-foreground">
                  Create a category first before adding transactions.
               </p>
            </div>
         )}

         {/* Transactions Table */}
         <TransactionsTable
            transactions={transactions}
            onEdit={(trans) => {
               setEditingTransaction(trans);
               setShowModal(true);
            }}
            onRefresh={() => loadTransactions(pagination.page)}
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
            title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
         >
            <TransactionForm
               categories={initialCategories}
               initialData={editingTransaction}
               onClose={handleCloseModal}
               onSuccess={handleSuccess}
            />
         </Modal>
      </div>
   );
}
