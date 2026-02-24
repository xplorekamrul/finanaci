"use client";

import { Loan, Savings, FinanceCategory } from "@prisma/client";
import { Banknote, HandshakeIcon } from "lucide-react";

interface LoansAndSavingsCardProps {
   loans: (Loan & { category: FinanceCategory | null })[];
   savings: (Savings & { category: FinanceCategory | null })[];
   totalLoans: number;
   totalSavings: number;
}

export default function LoansAndSavingsCard({
   loans,
   savings,
   totalLoans,
   totalSavings,
}: LoansAndSavingsCardProps) {
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
      <div className="space-y-6">
         {/* Loans Section */}
         <div className="space-y-4">
            <div className="flex items-center gap-2">
               <HandshakeIcon className="h-5 w-5 text-primary" />
               <h3 className="text-lg font-semibold text-foreground">Loans Given</h3>
               <span className="ml-auto text-sm font-medium text-muted-foreground">
                  Total: {totalLoans.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
               </span>
            </div>

            {loans.length === 0 ? (
               <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 text-center text-muted-foreground">
                  No loans this month
               </div>
            ) : (
               <>
                  {/* Mobile Cards View */}
                  <div className="md:hidden grid grid-cols-1 gap-3">
                     {loans.map((loan) => (
                        <div key={loan.id} className="card-snake-border bg-card rounded-lg shadow p-3 space-y-2">
                           <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                 <p className="font-medium text-foreground text-sm truncate">{loan.personName}</p>
                                 <p className="text-xs text-muted-foreground">{formatDate(loan.loanDate)}</p>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(loan.status)}`}>
                                 {loan.status}
                              </span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                 {loan.category?.name || "-"}
                              </span>
                              <span className="font-semibold text-sm text-foreground">
                                 {loan.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {loan.currency}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="bg-muted/90 backdrop-blur">
                              <tr>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Person</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                                 <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border">
                              {loans.map((loan, idx) => (
                                 <tr key={loan.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-primary/5"} hover:bg-primary/10`}>
                                    <td className="px-4 py-3 text-foreground font-medium">{loan.personName}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{loan.category?.name || "-"}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                                       {loan.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {loan.currency}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{formatDate(loan.loanDate)}</td>
                                    <td className="px-4 py-3">
                                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                                          {loan.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </>
            )}
         </div>

         {/* Savings Section */}
         <div className="space-y-4">
            <div className="flex items-center gap-2">
               <Banknote className="h-5 w-5 text-primary" />
               <h3 className="text-lg font-semibold text-foreground">Bank Savings</h3>
               <span className="ml-auto text-sm font-medium text-muted-foreground">
                  Total: {totalSavings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
               </span>
            </div>

            {savings.length === 0 ? (
               <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 text-center text-muted-foreground">
                  No savings this month
               </div>
            ) : (
               <>
                  {/* Mobile Cards View */}
                  <div className="md:hidden grid grid-cols-1 gap-3">
                     {savings.map((saving) => (
                        <div key={saving.id} className="card-snake-border bg-card rounded-lg shadow p-3 space-y-2">
                           <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                 <p className="font-medium text-foreground text-sm truncate">{saving.bankName}</p>
                                 <p className="text-xs text-muted-foreground">{formatDate(saving.savingsDate)}</p>
                              </div>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                 {saving.category?.name || "-"}
                              </span>
                              <span className="font-semibold text-sm text-foreground">
                                 {saving.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {saving.currency}
                              </span>
                           </div>
                           {saving.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{saving.description}</p>
                           )}
                        </div>
                     ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead className="bg-muted/90 backdrop-blur">
                              <tr>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Bank</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                                 <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                                 <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border">
                              {savings.map((saving, idx) => (
                                 <tr key={saving.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-primary/5"} hover:bg-primary/10`}>
                                    <td className="px-4 py-3 text-foreground font-medium">{saving.bankName}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{saving.category?.name || "-"}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                                       {saving.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {saving.currency}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{formatDate(saving.savingsDate)}</td>
                                    <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{saving.description || "-"}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
