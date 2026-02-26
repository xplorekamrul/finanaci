"use client";

import { getTransactions } from "@/actions/finance/transactions";
import { Pagination } from "@/components/shared/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { FinanceCategory, Transaction } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import TransactionsTable from "./TransactionsTable";

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
   const [transactions, setTransactions] = useState<(Transaction & { category: FinanceCategory })[]>(
      initialTransactions
   );
   const [pagination, setPagination] = useState(initialPagination);
   const [editingTransaction, setEditingTransaction] = useState<
      (Transaction & { category: FinanceCategory }) | null
   >(null);
   const [showModal, setShowModal] = useState(false);

   const loadTransactions = useCallback(async (page: number = 1) => {
      try {
         const result = await getTransactions({ page });
         if (result.data) {
            const paginatedData = result.data as any;
            setTransactions(paginatedData.data || []);
            setPagination(paginatedData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
         }
      } catch (error) {
         console.error("Failed to load transactions:", error);
      }
   }, []);

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingTransaction(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      loadTransactions(1);
   };

   return (
      <div className="space-y-6">
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
