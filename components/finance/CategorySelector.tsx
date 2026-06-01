"use client";

import { CustomSelect } from "@/components/shared/custom-select";
import { FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useMemo } from "react";

interface CategorySelectorProps {
  categories: FinanceCategory[];
  value: string;
  onValueChange: (value: string) => void;
  onOpenModal?: () => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function CategorySelector({
  categories,
  value,
  onValueChange,
  onOpenModal,
  placeholder = "Select a category",
  error,
  label = "Category",
  required = false,
}: CategorySelectorProps) {
  // Memoize the options to prevent unnecessary re-renders and key warnings
  const options = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          title="Add new category"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      <CustomSelect
        value={value || ""}
        onValueChange={onValueChange}
        options={options}
        placeholder={placeholder}
        searchable
        searchPlaceholder="Search categories..."
        className={error ? "border-destructive" : ""}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
