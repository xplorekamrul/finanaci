"use client";

import { deleteTransaction } from "@/actions/finance/transactions";
import { FinanceCategory, Transaction } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import TransactionCard from "./TransactionCard";

interface TransactionsTableProps {
   transactions: (Transaction & { category: FinanceCategory })[];
   onEdit: (transaction: Transaction & { category: FinanceCategory }) => void;
   onRefresh: () => void;
}

export default function TransactionsTable({
   transactions,
   onEdit,
   onRefresh,
}: TransactionsTableProps) {
   const [deleting, setDeleting] = useState<string | null>(null);

   const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this transaction?")) return;

      setDeleting(id);
      try {
         await deleteTransaction({ id });
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
         alert("Failed to delete transaction");
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

   if (transactions.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-8 text-center text-muted-foreground">
            No transactions found. Create one to get started.
         </div>
      );
   }

   return (
      <>
         {/* Mobile Cards View */}
         <div className="md:hidden grid grid-cols-1 gap-4">
            {transactions.map((transaction) => (
               <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
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
                           Title
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Type
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Recurring
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {transactions.map((transaction, idx) => (
                        <tr
                           key={transaction.id}
                           className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                              } hover:bg-primary/10`}
                        >
                           <td className="px-6 py-4 text-sm text-foreground font-medium">{transaction.title}</td>
                           <td className="px-6 py-4 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                 {transaction.category.icon && <span>{transaction.category.icon}</span>}
                                 <span>{transaction.category.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm">
                              <span
                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === "INCOME"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}
                              >
                                 {transaction.type}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-right font-semibold">
                              <span
                                 className={
                                    transaction.type === "INCOME"
                                       ? "text-green-600 dark:text-green-400"
                                       : "text-red-600 dark:text-red-400"
                                 }
                              >
                                 {transaction.type === "INCOME" ? "+" : "-"}
                                 {transaction.amount.toFixed(2)} {transaction.currency}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                           </td>
                           <td className="px-6 py-4 text-sm">
                              {transaction.isRecurring ? (
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {transaction.frequency}
                                 </span>
                              ) : (
                                 <span className="text-muted-foreground">-</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button
                                    onClick={() => onEdit(transaction)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                    title="Edit"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button
                                    onClick={() => handleDelete(transaction.id)}
                                    disabled={deleting === transaction.id}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                                    title="Delete"
                                 >
                                    {deleting === transaction.id ? (
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
