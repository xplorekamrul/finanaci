"use client";

import { createSavings, updateSavings } from "@/actions/finance/savings";
import { savingsSchema } from "@/lib/validations/savings";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinanceCategory, Savings } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySelector } from "./CategorySelector";

interface SavingsFormProps {
  categories: FinanceCategory[];
  initialData?: (Savings & { category: FinanceCategory | null }) | null;
  onClose: () => void;
  onSuccess: () => void;
}

const getErrorMessage = (error: any): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error.message) return error.message as string;
  return "";
};

export default function SavingsForm({
  categories: initialCategories,
  initialData,
  onClose,
  onSuccess,
}: SavingsFormProps) {
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
    resolver: zodResolver(savingsSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        bankName: initialData.bankName,
        amount: initialData.amount.toString(),
        currency: initialData.currency,
        savingsDate: initialData.savingsDate instanceof Date
          ? initialData.savingsDate.toISOString().split("T")[0]
          : new Date(initialData.savingsDate).toISOString().split("T")[0],
        description: initialData.description || "",
        categoryId: initialData.categoryId,
      });
    } else {
      reset({
        bankName: "",
        amount: "",
        currency: "BDT",
        savingsDate: new Date().toISOString().split("T")[0],
        description: "",
        categoryId: "",
      });
    }
  }, [initialData, isEditMode, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        bankName: data.bankName,
        amount: parseFloat(data.amount),
        currency: data.currency,
        savingsDate: new Date(data.savingsDate),
        description: data.description || null,
        categoryId: data.categoryId,
      };

      if (isEditMode && initialData?.id) {
        await updateSavings({ ...submitData, id: initialData.id });
      } else {
        await createSavings(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error("Form error:", error);
      alert("Failed to save savings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {isEditMode ? "Update Savings" : "Add Savings"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Name */}
        <div className="space-y-2">
          <label htmlFor="bankName" className="text-sm font-medium text-foreground">
            Bank Name <span className="text-destructive">*</span>
          </label>
          <input
            id="bankName"
            type="text"
            placeholder="e.g., ABC Bank"
            {...register("bankName")}
            className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.bankName ? "border-destructive" : "border-border"
              }`}
          />
          {errors.bankName && <p className="text-sm text-destructive">{getErrorMessage(errors.bankName)}</p>}
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
        <CategorySelector
          categories={categories}
          value={watch("categoryId")}
          onValueChange={(value) => setValue("categoryId", value)}
          onCategoriesUpdate={setCategories}
          error={errors.categoryId ? getErrorMessage(errors.categoryId) : undefined}
          label="Category"
        />

        {/* Savings Date */}
        <div className="space-y-2">
          <label htmlFor="savingsDate" className="text-sm font-medium text-foreground">
            Savings Date <span className="text-destructive">*</span>
          </label>
          <input
            id="savingsDate"
            type="date"
            {...register("savingsDate")}
            className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.savingsDate ? "border-destructive" : "border-border"
              }`}
          />
          {errors.savingsDate && <p className="text-sm text-destructive">{getErrorMessage(errors.savingsDate)}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Add notes about this savings..."
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
