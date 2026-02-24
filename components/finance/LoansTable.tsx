"use client";

import { deleteLoan } from "@/actions/finance/loans";
import { FinanceCategory, Loan } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import LoanCardMobile from "./LoanCardMobile";

interface LoansTableProps {
   loans: (Loan & { category: FinanceCategory | null })[];
   onEdit: (loan: Loan & { category: FinanceCategory | null }) => void;
   onRefresh: () => void;
}

export default function LoansTable({ loans, onEdit, onRefresh }: LoansTableProps) {
   const [deleting, setDeleting] = useState<string | null>(null);

   const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this loan?")) return;

      setDeleting(id);
      try {
         await deleteLoan({ id });
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
         alert("Failed to delete loan");
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

   if (loans.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-8 text-center text-muted-foreground">
            No loans found. Add one to get started.
         </div>
      );
   }

   return (
      <>
         {/* Mobile Cards View */}
         <div className="md:hidden grid grid-cols-1 gap-4">
            {loans.map((loan) => (
               <LoanCardMobile
                  key={loan.id}
                  loan={loan}
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
                           Person Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Category
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Loan Date
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
                     {loans.map((loan, idx) => (
                        <tr
                           key={loan.id}
                           className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                              } hover:bg-primary/10`}
                        >
                           <td className="px-6 py-4 text-sm font-medium text-foreground">{loan.personName}</td>
                           <td className="px-6 py-4 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                 {loan.category?.icon && <span>{loan.category.icon}</span>}
                                 <span>{loan.category?.name || "-"}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                              {loan.amount.toLocaleString("en-US", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}{" "}
                              {loan.currency}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(loan.loanDate)}
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {loan.returnDate ? formatDate(loan.returnDate) : "-"}
                           </td>
                           <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                                 {loan.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button
                                    onClick={() => onEdit(loan)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                    title="Edit"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button
                                    onClick={() => handleDelete(loan.id)}
                                    disabled={deleting === loan.id}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                                    title="Delete"
                                 >
                                    {deleting === loan.id ? (
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
