"use client";

import { deleteLoan } from "@/actions/finance/loans";
import { FinanceCategory, Loan } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface LoanCardProps {
   loan: Loan & { category: FinanceCategory | null };
   onEdit: (loan: Loan & { category: FinanceCategory | null }) => void;
   onRefresh: () => void;
}

export default function LoanCard({ loan, onEdit, onRefresh }: LoanCardProps) {
   const [deleting, setDeleting] = useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

   const handleDeleteClick = () => {
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
      setDeleting(true);
      try {
         await deleteLoan({ id: loan.id });
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

   const getStatusColor = (status: string) => {
      switch (status) {
         case "PENDING":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
         case "RETURNED":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
         case "OVERDUE":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Loan"
            description="Are you sure you want to delete this loan? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            isLoading={deleting}
         />
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
            {/* Header with Actions */}
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{loan.personName}</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(loan.loanDate)}</p>
               </div>
               <div className="flex gap-2 shrink-0">
                  <button
                     onClick={() => onEdit(loan)}
                     className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                     title="Edit"
                  >
                     <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                     onClick={handleDeleteClick}
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
            {loan.category && (
               <div className="flex items-center gap-2">
                  {/* {loan.category.icon && <span className="text-lg">{loan.category.icon}</span>} */}
                  <span className="text-sm text-muted-foreground">{loan.category.name}</span>
               </div>
            )}

            {/* Amount */}
            <div className="pt-2 border-t border-border">
               <p className="text-xs text-muted-foreground mb-1">Amount</p>
               <p className="text-2xl font-bold text-foreground">
                  {loan.amount.toLocaleString("en-US", {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2,
                  })}{" "}
                  {loan.currency}
               </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
               <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(loan.loanDate)}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1">Return Date</p>
                  <p className="text-sm font-medium text-foreground">
                     {loan.returnDate ? formatDate(loan.returnDate) : "-"}
                  </p>
               </div>
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-border">
               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                  {loan.status}
               </span>
            </div>

            {/* Description */}
            {loan.description && (
               <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground line-clamp-2">{loan.description}</p>
               </div>
            )}
         </div>
      </>
   );
}
