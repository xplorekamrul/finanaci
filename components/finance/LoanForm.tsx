"use client";

import { createLoan, updateLoan } from "@/actions/finance/loans";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { loanSchema } from "@/lib/validations/loans";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinanceCategory, Loan } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySelector } from "./CategorySelector";

interface LoanFormProps {
   categories: FinanceCategory[];
   initialData?: (Loan & { category: FinanceCategory | null }) | null;
   onClose: () => void;
   onSuccess: () => void;
}

const getErrorMessage = (error: any): string => {
   if (!error) return "";
   if (typeof error === "string") return error;
   if (error.message) return error.message as string;
   return "";
};

export default function LoanForm({
   categories: initialCategories,
   initialData,
   onClose,
   onSuccess,
}: LoanFormProps) {
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState(initialCategories);
   const isEditMode = !!initialData?.id;

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
      setValue,
   } = useForm<any>({
      resolver: zodResolver(loanSchema),
      mode: "onBlur",
   });

   useEffect(() => {
      if (isEditMode && initialData) {
         reset({
            personName: initialData.personName,
            amount: initialData.amount.toString(),
            currency: initialData.currency,
            loanDate: initialData.loanDate instanceof Date
               ? initialData.loanDate.toISOString().split("T")[0]
               : new Date(initialData.loanDate).toISOString().split("T")[0],
            returnDate: initialData.returnDate
               ? initialData.returnDate instanceof Date
                  ? initialData.returnDate.toISOString().split("T")[0]
                  : new Date(initialData.returnDate).toISOString().split("T")[0]
               : "",
            description: initialData.description || "",
            status: initialData.status,
            categoryId: initialData.categoryId,
         });
      } else {
         reset({
            personName: "",
            amount: "",
            currency: "BDT",
            loanDate: new Date().toISOString().split("T")[0],
            returnDate: "",
            description: "",
            status: "PENDING",
            categoryId: "",
         });
      }
   }, [initialData, isEditMode, reset]);

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         const submitData = {
            personName: data.personName,
            amount: parseFloat(data.amount),
            currency: data.currency,
            loanDate: new Date(data.loanDate),
            returnDate: data.returnDate ? new Date(data.returnDate) : null,
            description: data.description || null,
            status: data.status,
            categoryId: data.categoryId,
         };

         if (isEditMode && initialData?.id) {
            await updateLoan({ ...submitData, id: initialData.id });
         } else {
            await createLoan(submitData);
         }
         onSuccess();
      } catch (error) {
         console.error("Form error:", error);
         alert("Failed to save loan");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div>
            <h2 className="text-2xl font-semibold text-foreground">
               {isEditMode ? "Update Loan" : "Add Loan"}
            </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person Name */}
            <div className="space-y-2">
               <label htmlFor="personName" className="text-sm font-medium text-foreground">
                  Person Name <span className="text-destructive">*</span>
               </label>
               <input
                  id="personName"
                  type="text"
                  placeholder="e.g., John Doe"
                  {...register("personName")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.personName ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.personName && <p className="text-sm text-destructive">{getErrorMessage(errors.personName)}</p>}
            </div>

            {/* Amount */}
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

            {/* Currency */}
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

            {/* Category */}
            <div className="space-y-2">
               <CategorySelector
                  categories={categories}
                  value={watch("categoryId")}
                  onValueChange={(value) => setValue("categoryId", value)}
                  onCategoriesUpdate={setCategories}
                  error={errors.categoryId ? getErrorMessage(errors.categoryId) : undefined}
                  label="Category"
               />
            </div>

            {/* Loan Date */}
            <div className="space-y-2">
               <label htmlFor="loanDate" className="text-sm font-medium text-foreground">
                  Loan Date <span className="text-destructive">*</span>
               </label>
               <input
                  id="loanDate"
                  type="date"
                  {...register("loanDate")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.loanDate ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.loanDate && <p className="text-sm text-destructive">{getErrorMessage(errors.loanDate)}</p>}
            </div>

            {/* Return Date */}
            <div className="space-y-2">
               <label htmlFor="returnDate" className="text-sm font-medium text-foreground">
                  Return Date
               </label>
               <input
                  id="returnDate"
                  type="date"
                  {...register("returnDate")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.returnDate ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.returnDate && <p className="text-sm text-destructive">{getErrorMessage(errors.returnDate)}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">
                  Status
               </label>
               <Select value={watch("status") || ""} onValueChange={(value) => setValue("status", value)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="PENDING">Pending</SelectItem>
                     <SelectItem value="RETURNED">Returned</SelectItem>
                     <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
               </Select>
               {errors.status && <p className="text-sm text-destructive">{getErrorMessage(errors.status)}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
               <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
               </label>
               <textarea
                  id="description"
                  placeholder="Why did you give this loan?"
                  {...register("description")}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${errors.description ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.description && <p className="text-sm text-destructive">{getErrorMessage(errors.description)}</p>}
            </div>
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
