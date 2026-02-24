"use client";

import { createFinanceCategory, updateFinanceCategory } from "@/actions/finance/categories";
import { FinanceCategoryValues, financeCategorySchema } from "@/lib/validations/finance";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CategoryFormProps {
   initialData?: {
      id: string;
      name: string;
      type: TransactionType;
      icon: string | null;
      color: string | null;
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

export default function CategoryForm({ initialData, onClose, onSuccess }: CategoryFormProps) {
   const [loading, setLoading] = useState(false);
   const isEditMode = !!initialData?.id;

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<FinanceCategoryValues>({
      resolver: zodResolver(financeCategorySchema),
      defaultValues: initialData || {
         name: "",
         type: TransactionType.EXPENSE,
         icon: "",
         color: "",
      },
   });

   useEffect(() => {
      if (isEditMode && initialData) {
         reset(initialData);
      } else {
         reset({
            name: "",
            type: TransactionType.EXPENSE,
            icon: "",
            color: "",
         });
      }
   }, [initialData, isEditMode, reset]);

   const onSubmit = async (data: FinanceCategoryValues) => {
      setLoading(true);
      try {
         if (isEditMode && initialData?.id) {
            await updateFinanceCategory({ ...data, id: initialData.id });
         } else {
            await createFinanceCategory(data);
         }
         onSuccess();
         reset();
      } catch (error) {
         console.error("Form error:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
               {isEditMode ? "Update Category" : "Create Category"}
            </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
               <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Category Name <span className="text-destructive">*</span>
               </label>
               <input
                  id="name"
                  type="text"
                  placeholder="e.g., Groceries"
                  {...register("name")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.name && <p className="text-sm text-destructive">{getErrorMessage(errors.name)}</p>}
            </div>

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
                  <option value={TransactionType.EXPENSE}>Expense</option>
                  <option value={TransactionType.INCOME}>Income</option>
               </select>
               {errors.type && <p className="text-sm text-destructive">{getErrorMessage(errors.type)}</p>}
            </div>

            {/* Icon Field */}
            <div className="space-y-2">
               <label htmlFor="icon" className="text-sm font-medium text-foreground">
                  Icon (emoji or name)
               </label>
               <input
                  id="icon"
                  type="text"
                  placeholder="e.g., 🛒 or shopping"
                  {...register("icon")}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.icon ? "border-destructive" : "border-border"
                     }`}
               />
               {errors.icon && <p className="text-sm text-destructive">{getErrorMessage(errors.icon)}</p>}
            </div>

            {/* Color Field */}
            <div className="space-y-2">
               <label htmlFor="color" className="text-sm font-medium text-foreground">
                  Color (hex code)
               </label>
               <div className="flex gap-2">
                  <input
                     id="color"
                     type="text"
                     placeholder="e.g., #FF5733"
                     {...register("color")}
                     className={`flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.color ? "border-destructive" : "border-border"
                        }`}
                  />
                  <input
                     type="color"
                     {...register("color")}
                     className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
               </div>
               {errors.color && <p className="text-sm text-destructive">{getErrorMessage(errors.color)}</p>}
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
