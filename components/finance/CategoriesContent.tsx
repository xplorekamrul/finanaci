"use client";

import { getFinanceCategories } from "@/actions/finance/categories";
import { FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import Modal from "./Modal";

interface CategoriesContentProps {
   initialCategories: FinanceCategory[];
}

export default function CategoriesContent({ initialCategories }: CategoriesContentProps) {
   const [categories, setCategories] = useState<FinanceCategory[]>(initialCategories);
   const [editingCategory, setEditingCategory] = useState<FinanceCategory | null>(null);
   const [showModal, setShowModal] = useState(false);

   const loadCategories = useCallback(async () => {
      try {
         const result = await getFinanceCategories();
         if (result.data) setCategories(result.data);
      } catch (error) {
         console.error("Failed to load categories:", error);
      }
   }, []);

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingCategory(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      loadCategories();
   };

   return (
      <div className="space-y-6">
         {/* Header with Add Button */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-foreground">Finance Categories</h2>
               <p className="text-sm text-muted-foreground">Organize your transactions by category</p>
            </div>
            <button
               onClick={() => {
                  setEditingCategory(null);
                  setShowModal(true);
               }}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
               <Plus className="h-4 w-4" />
              
            </button>
         </div>

         {/* Categories Table */}
         <CategoriesTable
            categories={categories}
            onEdit={(cat) => {
               setEditingCategory(cat);
               setShowModal(true);
            }}
            onRefresh={loadCategories}
         />

         {/* Modal for Create/Edit */}
         <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            title={editingCategory ? "Edit Category" : "Add Category"}
         >
            <CategoryForm
               initialData={editingCategory}
               onClose={handleCloseModal}
               onSuccess={handleSuccess}
            />
         </Modal>
      </div>
   );
}
