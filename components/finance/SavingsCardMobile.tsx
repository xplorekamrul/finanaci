"use client";

import { deleteSavings } from "@/actions/finance/savings";
import { FinanceCategory, Savings } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface SavingsCardProps {
   saving: Savings & { category: FinanceCategory | null };
   onEdit: (saving: Savings & { category: FinanceCategory | null }) => void;
   onRefresh: () => void;
}

export default function SavingsCardMobile({ saving, onEdit, onRefresh }: SavingsCardProps) {
   const [deleting, setDeleting] = useState(false);

   const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this savings record?")) return;

      setDeleting(true);
      try {
         await deleteSavings({ id: saving.id });
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
         alert("Failed to delete savings");
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

   return (
      <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
         {/* Header with Actions */}
         <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-foreground truncate">{saving.bankName}</h3>
               <p className="text-sm text-muted-foreground">{formatDate(saving.savingsDate)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
               <button
                  onClick={() => onEdit(saving)}
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
         {saving.category && (
            <div className="flex items-center gap-2">
               {saving.category.icon && <span className="text-lg">{saving.category.icon}</span>}
               <span className="text-sm text-muted-foreground">{saving.category.name}</span>
            </div>
         )}

         {/* Amount */}
         <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Amount</p>
            <p className="text-2xl font-bold text-foreground">
               {saving.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               })}{" "}
               {saving.currency}
            </p>
         </div>

         {/* Description */}
         {saving.description && (
            <div className="pt-2 border-t border-border">
               <p className="text-xs text-muted-foreground mb-1">Description</p>
               <p className="text-sm text-foreground line-clamp-2">{saving.description}</p>
            </div>
         )}
      </div>
   );
}
