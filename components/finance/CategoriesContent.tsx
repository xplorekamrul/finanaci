"use client";

import { getFinanceCategories } from "@/actions/finance/categories";
import { Pagination } from "@/components/shared/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import Modal from "./Modal";

interface CategoriesContentProps {
   initialCategories: FinanceCategory[];
   initialPagination: PaginatedResponse<any>["pagination"];
}

export default function CategoriesContent({
   initialCategories,
   initialPagination,
}: CategoriesContentProps) {
   const [categories, setCategories] = useState<FinanceCategory[]>(initialCategories);
   const [pagination, setPagination] = useState(initialPagination);
   const [editingCategory, setEditingCategory] = useState<FinanceCategory | null>(null);
   const [showModal, setShowModal] = useState(false);

   const loadCategories = useCallback(async (page: number = 1) => {
      try {
         const result = await getFinanceCategories({ page });
         if (result.data) {
            const paginatedData = result.data as any;
            setCategories(paginatedData.data || []);
            setPagination(paginatedData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
         }
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
      loadCategories(1);
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
            onRefresh={() => loadCategories(pagination.page)}
         />

         {/* Pagination */}
         <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
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
