"use client";

import { createTransaction, updateTransaction } from "@/actions/finance/transactions";
import { transactionSchema } from "@/lib/validations/finance";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinanceCategory, Frequency, TransactionType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface TransactionFormProps {
   categories: FinanceCategory[];
   initialData?: {
      id: string;
      type: TransactionType;
      title: string;
      description: string | null;
      amount: number;
      currency: string;
      date: Date;
      isRecurring: boolean;
      frequency: Frequency | null;
      categoryId: string;
   } | null;
   onClose: () => void;
   onSuccess: () => void;
}

const getErrorMessage = (error: any): string => {
   if (!error) return "";
   if (typeof error === "string") return error;
   if (error.message) return error.message as string;
   return "";
};

export default function TransactionForm({
   categories,
   initialData,
   onClose,
   onSuccess,
}: TransactionFormProps) {
   const [loading, setLoading] = useState(false);
   const isEditMode = !!initialData?.id;

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
   } = useForm<any>({
      resolver: zodResolver(transactionSchema),
      mode: "onBlur",
   });

   const isRecurring = watch("isRecurring");

   useEffect(() => {
      if (isEditMode && initialData) {
         reset({
            type: initialData.type,
            title: initialData.title,
            description: initialData.description || "",
            amount: initialData.amount.toString(),
            currency: initialData.currency,
            date: initialData.date instanceof Date
               ? initialData.date.toISOString().split("T")[0]
               : new Date(initialData.date).toISOString().split("T")[0],
            isRecurring: initialData.isRecurring,
            frequency: initialData.frequency,
            categoryId: initialData.categoryId,
         });
      } else {
         reset({
            type: TransactionType.EXPENSE,
            title: "",
            description: "",
            amount: "",
            currency: "BDT",
            date: new Date().toISOString().split("T")[0],
            isRecurring: false,
            frequency: null,
            categoryId: "",
         });
      }
   }, [initialData, isEditMode, reset]);

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         const submitData = {
            type: data.type,
            title: data.title,
            description: data.description || null,
            amount: parseFloat(data.amount),
            currency: data.currency,
            date: new Date(data.date),
            isRecurring: data.isRecurring,
            frequency: data.isRecurring ? data.frequency : null,
            categoryId: data.categoryId,
         };

         if (isEditMode && initialData?.id) {
            await updateTransaction({ ...submitData, id: initialData.id });
         } else {
            await createTransaction(submitData);
         }
         onSuccess();
      } catch (error) {
         console.error("Form error:", error);
         alert("Failed to save transaction");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div>
            <h2 className="text-2xl font-semibold text-foreground">
               {isEditMode ? "Update Transaction" : "Create Transaction"}
            </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Field */}
            <div className="space-y-2">
               <label htmlFor="type" className="text-sm font-medium text-foreground">
                  Type <span className="text-destructive">*</span>
               </label>
               <select
                  id="type"
                  {...register("type")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.type ? "border-destructive" : "border-border"
                     }`}
               >
                  <option value="">Select type</option>
                  <option value={TransactionType.EXPENSE}>Expense</option>
                  <option value={TransactionType.INCOME}>Income</option>
               </select>
               {errors.type && <p className="text-sm text-destructive">{getErrorMessage(errors.type)}</p>}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
               <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
                  Category <span className="text-destructive">*</span>
               </label>
               <select
                  id="categoryId"
                  {...register("categoryId")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.categoryId ? "border-destructive" : "border-border"
                     }`}
               >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                     <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                     </option>
                  ))}
               </select>
               {errors.categoryId && <p className="text-sm text-destructive">{getErrorMessage(errors.categoryId)}</p>}
            </div>

            {/* Title Field */}
            <div className="space-y-2">
               <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
               </label>
               <input
                  id="title"
                  type="text"
                  placeholder="e.g., Weekly groceries"
                  {...register("title")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.title ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.title && <p className="text-sm text-destructive">{getErrorMessage(errors.title)}</p>}
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
               <label htmlFor="amount" className="text-sm font-medium text-foreground">
                  Amount <span className="text-destructive">*</span>
               </label>
               <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.amount ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.amount && <p className="text-sm text-destructive">{getErrorMessage(errors.amount)}</p>}
            </div>

            {/* Currency Field */}
            <div className="space-y-2">
               <label htmlFor="currency" className="text-sm font-medium text-foreground">
                  Currency
               </label>
               <input
                  id="currency"
                  type="text"
                  placeholder="BDT"
                  {...register("currency")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.currency ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.currency && <p className="text-sm text-destructive">{getErrorMessage(errors.currency)}</p>}
            </div>

            {/* Date Field */}
            <div className="space-y-2">
               <label htmlFor="date" className="text-sm font-medium text-foreground">
                  Date <span className="text-destructive">*</span>
               </label>
               <input
                  id="date"
                  type="date"
                  {...register("date")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.date ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.date && <p className="text-sm text-destructive">{getErrorMessage(errors.date)}</p>}
            </div>

            {/* Description Field */}
            <div className="md:col-span-2 space-y-2">
               <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
               </label>
               <textarea
                  id="description"
                  placeholder="Add notes about this transaction..."
                  {...register("description")}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${errors.description ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.description && <p className="text-sm text-destructive">{getErrorMessage(errors.description)}</p>}
            </div>

            {/* Recurring Checkbox */}
            <div className="space-y-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                     type="checkbox"
                     {...register("isRecurring")}
                     className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Is Recurring?</span>
               </label>
            </div>

            {/* Frequency Field (conditional) */}
            {isRecurring && (
               <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium text-foreground">
                     Frequency
                  </label>
                  <select
                     id="frequency"
                     {...register("frequency")}
                     className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.frequency ? "border-destructive" : "border-border"
                        }`}
                  >
                     <option value="">Select frequency</option>
                     <option value={Frequency.DAILY}>Daily</option>
                     <option value={Frequency.WEEKLY}>Weekly</option>
                     <option value={Frequency.MONTHLY}>Monthly</option>
                     <option value={Frequency.YEARLY}>Yearly</option>
                  </select>
                  {errors.frequency && <p className="text-sm text-destructive">{getErrorMessage(errors.frequency)}</p>}
               </div>
            )}
         </div>

         {/* Buttons */}
         <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
               type="button"
               onClick={onClose}
               disabled={loading}
               className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
               {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                  </svg>
               )}
               {loading ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update" : "Save"}
            </button>
         </div>
      </form>
   );
}
