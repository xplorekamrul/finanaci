"use client";

import { deleteTransaction } from "@/actions/finance/transactions";
import { FinanceCategory, Transaction } from "@prisma/client";
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface TransactionCardProps {
   transaction: Transaction & { category: FinanceCategory };
   onEdit: (transaction: Transaction & { category: FinanceCategory }) => void;
   onRefresh: () => void;
}

export default function TransactionCard({
   transaction,
   onEdit,
   onRefresh,
}: TransactionCardProps) {
   const [deleting, setDeleting] = useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [descExpanded, setDescExpanded] = useState(false);

   const handleDeleteClick = () => setDeleteDialogOpen(true);

   const handleConfirmDelete = async () => {
      setDeleting(true);
      try {
         await deleteTransaction({ id: transaction.id });
         setDeleteDialogOpen(false);
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
      } finally {
         setDeleting(false);
      }
   };

   const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const isIncome = transaction.type === "INCOME";

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            isLoading={deleting}
         />

         <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-3">

            {/* Row 1: Title + Actions */}
            <div className="flex items-center justify-between gap-2">
               <h3 className="font-semibold text-foreground truncate flex-1 min-w-0">
                  {transaction.title}
               </h3>
               <div className="flex gap-1 shrink-0">
                  <button
                     onClick={() => onEdit(transaction)}
                     className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                     title="Edit"
                  >
                     <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                     onClick={handleDeleteClick}
                     disabled={deleting}
                     className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                     title="Delete"
                  >
                     {deleting ? (
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                        </svg>
                     ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                     )}
                  </button>
               </div>
            </div>

            {/* Row 2: Date + Category Badge */}
            <div className="flex items-center gap-2 flex-wrap">
               <span className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
               </span>
               <span className="text-muted-foreground text-xs">·</span>
               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  {/* {transaction.category.icon && (
                     <span className="text-sm leading-none">{transaction.category.icon}</span>
                  )} */}
                  {transaction.category.name}
               </span>
            </div>

            {/* Row 3: Amount label + Type badge + Frequency badge */}
            <div className="flex items-center gap-2 flex-wrap">
               <span className="text-xs text-muted-foreground font-medium">Amount</span>
               <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                     isIncome
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  }`}
               >
                  {transaction.type}
               </span>
               {transaction.isRecurring && transaction.frequency && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                     {transaction.frequency}
                  </span>
               )}
            </div>

            {/* Amount Value */}
            <p
               className={`text-2xl font-bold tracking-tight ${
                  isIncome
                     ? "text-green-600 dark:text-green-400"
                     : "text-red-600 dark:text-red-400"
               }`}
            >
               {isIncome ? "+" : "-"}
               {transaction.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               })}{" "}
               <span className="text-sm font-medium opacity-70">{transaction.currency}</span>
            </p>

            {/* Description with collapsible toggle */}
            {transaction.description && (
               <div className="pt-2 border-t border-border">
                  <div className="flex items-start gap-2">
                     <p
                        className={`text-sm text-foreground flex-1 min-w-0 transition-all duration-300 ease-in-out ${
                           descExpanded ? "" : "line-clamp-1"
                        }`}
                     >
                        {transaction.description}
                     </p>
                     <button
                        onClick={() => setDescExpanded((prev) => !prev)}
                        className="shrink-0 p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground mt-0.5"
                        title={descExpanded ? "Collapse" : "Expand"}
                     >
                        {descExpanded ? (
                           <ChevronUp className="h-4 w-4" />
                        ) : (
                           <ChevronDown className="h-4 w-4" />
                        )}
                     </button>
                  </div>
               </div>
            )}

         </div>
      </>
   );
}