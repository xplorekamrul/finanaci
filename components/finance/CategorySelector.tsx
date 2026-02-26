"use client";

import { createFinanceCategory } from "@/actions/finance/categories";
import { CustomSelect } from "@/components/shared/custom-select";
import { FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import CategoryFormContent from "./CategoryFormContent";
import Modal from "./Modal";

interface CategorySelectorProps {
  categories: FinanceCategory[];
  value: string;
  onValueChange: (value: string) => void;
  onCategoriesUpdate: (categories: FinanceCategory[]) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function CategorySelector({
  categories,
  value,
  onValueChange,
  onCategoriesUpdate,
  placeholder = "Select a category",
  error,
  label = "Category",
  required = false,
}: CategorySelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = useCallback(async (categoryData: any) => {
    setIsCreating(true);
    try {
      const result = await createFinanceCategory(categoryData);
      if (result.data) {
        const newCategories = [...categories, result.data];
        onCategoriesUpdate(newCategories);
        onValueChange(result.data.id);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  }, [categories, onCategoriesUpdate, onValueChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowModal(true)}
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
        options={categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
        placeholder={placeholder}
        searchable
        searchPlaceholder="Search categories..."
        className={error ? "border-destructive" : ""}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Modal
        isOpen={showModal}
        onClose={() => !isCreating && setShowModal(false)}
        title="Create New Category"
      >
        <CategoryFormContent
          initialData={null}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
          }}
          onCategoryCreated={handleCreateCategory}
        />
      </Modal>
    </div>
  );
}
