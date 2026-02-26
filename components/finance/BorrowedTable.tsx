"use client";

import { deleteBorrowed } from "@/actions/finance/borrowed";
import { Borrowed, FinanceCategory } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface BorrowedTableProps {
   borrowed: (Borrowed & { category: FinanceCategory | null })[];
   onEdit: (borrowed: Borrowed & { category: FinanceCategory | null }) => void;
   onRefresh: () => void;
}

export default function BorrowedTable({ borrowed, onEdit, onRefresh }: BorrowedTableProps) {
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
         await deleteBorrowed({ id: deleteId });
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

   if (borrowed.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-8 text-center text-muted-foreground">
            No borrowed records found. Add one to get started.
         </div>
      );
   }

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Borrowed Record"
            description="Are you sure you want to delete this borrowed record? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => {
               setDeleteDialogOpen(false);
               setDeleteId(null);
            }}
            isLoading={deleting === deleteId}
         />
         {/* Mobile Cards View */}
         <div className="md:hidden grid grid-cols-1 gap-4">
            {borrowed.map((item) => (
               <div key={item.id} className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
                  {/* Header with Actions */}
                  <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.lenderName}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(item.borrowDate)}</p>
                     </div>
                     <div className="flex gap-2 shrink-0">
                        <button
                           onClick={() => onEdit(item)}
                           className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                           title="Edit"
                        >
                           <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                           onClick={() => handleDeleteClick(item.id)}
                           disabled={deleting === item.id}
                           className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                           title="Delete"
                        >
                           {deleting === item.id ? (
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

                  {/* Amount */}
                  <div className="pt-2 border-t border-border">
                     <p className="text-xs text-muted-foreground mb-1">Amount</p>
                     <p className="text-2xl font-bold text-foreground">
                        {item.amount.toLocaleString("en-US", {
                           minimumFractionDigits: 2,
                           maximumFractionDigits: 2,
                        })}{" "}
                        {item.currency}
                     </p>
                     {item.interest > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">Interest: {item.interest}%</p>
                     )}
                  </div>

                  {/* Dates & Status */}
                  <div className="space-y-2 pt-2 border-t border-border">
                     {item.returnDate && (
                        <div>
                           <p className="text-xs text-muted-foreground mb-1">Expected Return</p>
                           <p className="text-sm text-foreground">{formatDate(item.returnDate)}</p>
                        </div>
                     )}
                     {item.actualReturnDate && (
                        <div>
                           <p className="text-xs text-muted-foreground mb-1">Actual Return</p>
                           <p className="text-sm text-foreground">{formatDate(item.actualReturnDate)}</p>
                        </div>
                     )}
                     <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                           {item.status}
                        </span>
                     </div>
                  </div>

                  {/* Category & Description */}
                  {(item.category || item.description) && (
                     <div className="pt-2 border-t border-border space-y-2">
                        {item.category && (
                           <div className="flex items-center gap-2">
                              {/* {item.category.icon && <span className="text-lg">{item.category.icon}</span>} */}
                              <span className="text-sm text-muted-foreground">{item.category.name}</span>
                           </div>
                        )}
                        {item.description && (
                           <div>
                              <p className="text-xs text-muted-foreground mb-1">Description</p>
                              <p className="text-sm text-foreground line-clamp-2">{item.description}</p>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            ))}
         </div>

         {/* Desktop Table View */}
         <div className="hidden md:block card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur shadow-sm">
                     <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Lender Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Category
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Amount
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Interest
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Borrow Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Return Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {borrowed.map((item, idx) => (
                        <tr
                           key={item.id}
                           className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                              } hover:bg-primary/10`}
                        >
                           <td className="px-6 py-4 text-sm font-medium text-foreground">{item.lenderName}</td>
                           <td className="px-6 py-4 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                 {/* {item.category?.icon && <span>{item.category.icon}</span>} */}
                                 <span>{item.category?.name || "N/P"}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                              {item.amount.toLocaleString("en-US", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}{" "}
                              {item.currency}
                           </td>
                           <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                              {item.interest > 0 ? `${item.interest}%` : "-"}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(item.borrowDate)}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {item.returnDate ? formatDate(item.returnDate) : "-"}
                           </td>
                           <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                 {item.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button
                                    onClick={() => onEdit(item)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                    title="Edit"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(item.id)}
                                    disabled={deleting === item.id}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                                    title="Delete"
                                 >
                                    {deleting === item.id ? (
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
