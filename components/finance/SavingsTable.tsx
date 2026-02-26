"use client";

import { deleteSavings } from "@/actions/finance/savings";
import { FinanceCategory, Savings } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import SavingsCardMobile from "./SavingsCardMobile";

interface SavingsTableProps {
   savings: (Savings & { category: FinanceCategory | null })[];
   onEdit: (saving: Savings & { category: FinanceCategory | null }) => void;
   onRefresh: () => void;
}

export default function SavingsTable({ savings, onEdit, onRefresh }: SavingsTableProps) {
   const [deleting, setDeleting] = useState<string | null>(null);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [deleteId, setDeleteId] = useState<string | null>(null);

   const handleDeleteClick = (id: string) => {
      setDeleteId(id);
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (!deleteId) return;

      setDeleting(deleteId);
      try {
         await deleteSavings({ id: deleteId });
         setDeleteDialogOpen(false);
         setDeleteId(null);
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
      } finally {
         setDeleting(null);
      }
   };

   const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   if (savings.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-8 text-center text-muted-foreground">
            No savings found. Add one to get started.
         </div>
      );
   }

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Savings"
            description="Are you sure you want to delete this savings record? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => {
               setDeleteDialogOpen(false);
               setDeleteId(null);
            }}
            isLoading={deleting === deleteId}
         />
         {/* Mobile Cards View */}
         <div className="md:hidden grid grid-cols-1 gap-4">
            {savings.map((saving) => (
               <SavingsCardMobile
                  key={saving.id}
                  saving={saving}
                  onEdit={onEdit}
                  onRefresh={onRefresh}
               />
            ))}
         </div>

         {/* Desktop Table View */}
         <div className="hidden md:block card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur shadow-sm">
                     <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Bank Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Category
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Description
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {savings.map((saving, idx) => (
                        <tr
                           key={saving.id}
                           className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                              } hover:bg-primary/10`}
                        >
                           <td className="px-6 py-4 text-sm font-medium text-foreground">{saving.bankName}</td>
                           <td className="px-6 py-4 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                 {/* {saving.category?.icon && <span>{saving.category.icon}</span>} */}
                                 <span>{saving.category?.name || "N/P"}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                              {saving.amount.toLocaleString("en-US", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}{" "}
                              {saving.currency}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(saving.savingsDate)}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-xs">
                              {saving.description || "-"}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button
                                    onClick={() => onEdit(saving)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                    title="Edit"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(saving.id)}
                                    disabled={deleting === saving.id}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                                    title="Delete"
                                 >
                                    {deleting === saving.id ? (
                                       <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                          <circle
                                             className="opacity-25"
                                             cx="12"
                                             cy="12"
                                             r="10"
                                             stroke="currentColor"
                                             strokeWidth="4"
                                          />
                                          <path
                                             className="opacity-75"
                                             fill="currentColor"
                                             d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                                          />
                                       </svg>
                                    ) : (
                                       <Trash2 className="h-4 w-4" />
                                    )}
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
}
