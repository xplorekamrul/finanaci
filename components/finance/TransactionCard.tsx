"use client";

import { deleteTransaction } from "@/actions/finance/transactions";
import { FinanceCategory, Transaction } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

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

   const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this transaction?")) return;

      setDeleting(true);
      try {
         await deleteTransaction({ id: transaction.id });
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
         alert("Failed to delete transaction");
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
      <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
         {/* Header with Actions */}
         <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-foreground truncate">{transaction.title}</h3>
               <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
               <button
                  onClick={() => onEdit(transaction)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                  title="Edit"
               >
                  <Edit2 className="h-4 w-4" />
               </button>
               <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                  title="Delete"
               >
                  {deleting ? (
                     <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                     </svg>
                  ) : (
                     <Trash2 className="h-4 w-4" />
                  )}
               </button>
            </div>
         </div>

         {/* Category */}
         <div className="flex items-center gap-2">
            {transaction.category.icon && <span className="text-lg">{transaction.category.icon}</span>}
            <span className="text-sm text-muted-foreground">{transaction.category.name}</span>
         </div>

         {/* Amount */}
         <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Amount</p>
            <p
               className={`text-2xl font-bold ${isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
            >
               {isIncome ? "+" : "-"}
               {transaction.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               })}{" "}
               {transaction.currency}
            </p>
         </div>

         {/* Type & Recurring */}
         <div className="flex gap-2 flex-wrap">
            <span
               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isIncome
                     ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                     : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
            >
               {transaction.type}
            </span>
            {transaction.isRecurring && (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {transaction.frequency}
               </span>
            )}
         </div>

         {/* Description */}
         {transaction.description && (
            <div className="pt-2 border-t border-border">
               <p className="text-xs text-muted-foreground mb-1">Description</p>
               <p className="text-sm text-foreground line-clamp-2">{transaction.description}</p>
            </div>
         )}
      </div>
   );
}
