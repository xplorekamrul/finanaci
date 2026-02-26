"use client";

import { createBorrowed, updateBorrowed } from "@/actions/finance/borrowed";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { borrowedSchema, BorrowedValues } from "@/lib/validations/borrowed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Borrowed, FinanceCategory } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySelector } from "./CategorySelector";

interface BorrowedFormProps {
   borrowed?: Borrowed & { category: FinanceCategory | null };
   categories: FinanceCategory[];
   onSuccess: () => void;
   onCancel: () => void;
}

export default function BorrowedForm({ borrowed, categories: initialCategories, onSuccess, onCancel }: BorrowedFormProps) {
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState(initialCategories);

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
   } = useForm<any>({
      resolver: zodResolver(borrowedSchema),
      defaultValues: borrowed
         ? {
            lenderName: borrowed.lenderName,
            amount: borrowed.amount,
            currency: borrowed.currency,
            borrowDate: new Date(borrowed.borrowDate).toISOString().split('T')[0],
            returnDate: borrowed.returnDate ? new Date(borrowed.returnDate).toISOString().split('T')[0] : "",
            actualReturnDate: borrowed.actualReturnDate ? new Date(borrowed.actualReturnDate).toISOString().split('T')[0] : "",
            interest: borrowed.interest,
            description: borrowed.description || "",
            status: borrowed.status,
            categoryId: borrowed.categoryId || "",
         }
         : {
            currency: "BDT",
            borrowDate: new Date().toISOString().split('T')[0],
            returnDate: "",
            actualReturnDate: "",
            interest: 0,
            status: "PENDING",
            description: "",
            categoryId: "",
         },
   });

   const onSubmit = async (data: BorrowedValues) => {
      setLoading(true);
      try {
         // Convert empty date strings to null
         const processedData = {
            ...data,
            returnDate: data.returnDate || null,
            actualReturnDate: data.actualReturnDate || null,
            categoryId: data.categoryId || null,
            description: data.description || null,
         };

         if (borrowed) {
            await updateBorrowed({ ...processedData, id: borrowed.id });
         } else {
            await createBorrowed(processedData);
         }
         onSuccess();
      } catch (error) {
         console.error("Form error:", error);
         alert("Failed to save borrowed record");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lender Name */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">
                  Lender Name <span className="text-red-500">*</span>
               </label>
               <input
                  {...register("lenderName")}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="Enter lender name"
               />
               {errors.lenderName && (
                  <p className="text-red-500 text-xs mt-1">{String(errors.lenderName.message)}</p>
               )}
            </div>

            {/* Amount */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">
                  Amount <span className="text-red-500">*</span>
               </label>
               <input
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="0.00"
               />
               {errors.amount && <p className="text-red-500 text-xs mt-1">{String(errors.amount.message)}</p>}
            </div>

            {/* Currency */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
               <input
                  {...register("currency")}
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="BDT"
               />
            </div>

            {/* Interest */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">Interest (%)</label>
               <input
                  {...register("interest", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  placeholder="0.00"
               />
               {errors.interest && <p className="text-red-500 text-xs mt-1">{String(errors.interest.message)}</p>}
            </div>

            {/* Borrow Date */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">
                  Borrow Date <span className="text-red-500">*</span>
               </label>
               <input
                  {...register("borrowDate")}
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
               />
               {errors.borrowDate && (
                  <p className="text-red-500 text-xs mt-1">{String(errors.borrowDate.message)}</p>
               )}
            </div>

            {/* Expected Return Date */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">Expected Return Date</label>
               <input
                  {...register("returnDate")}
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
               />
            </div>

            {/* Actual Return Date */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">Actual Return Date</label>
               <input
                  {...register("actualReturnDate")}
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
               />
            </div>

            {/* Status */}
            <div>
               <label className="block text-sm font-medium text-foreground mb-1">Status</label>
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
            </div>

            {/* Category */}
            <div className="md:col-span-2">
               <CategorySelector
                  categories={categories}
                  value={watch("categoryId")}
                  onValueChange={(value) => setValue("categoryId", value)}
                  onCategoriesUpdate={setCategories}
                  label="Category"
               />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-foreground mb-1">Description</label>
               <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                  placeholder="Why did you borrow this money?"
               />
            </div>
         </div>

         {/* Sticky Buttons */}
         <div className="sticky bottom-0 bg-card pt-4 pb-2 flex gap-3 justify-end border-t border-border mt-6">
            <button
               type="button"
               onClick={onCancel}
               className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
               disabled={loading}
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
               {loading ? "Saving..." : borrowed ? "Update" : "Create"}
            </button>
         </div>
      </form>
   );
}
