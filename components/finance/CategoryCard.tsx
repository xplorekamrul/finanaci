"use client";

import { deleteFinanceCategory } from "@/actions/finance/categories";
import { FinanceCategory } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface CategoryCardProps {
   category: FinanceCategory;
   onEdit: (category: FinanceCategory) => void;
   onRefresh: () => void;
}

export default function CategoryCard({ category, onEdit, onRefresh }: CategoryCardProps) {
   const [deleting, setDeleting] = useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

   const handleDeleteClick = () => {
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
      setDeleting(true);
      try {
         await deleteFinanceCategory({ id: category.id });
         setDeleteDialogOpen(false);
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
      } finally {
         setDeleting(false);
      }
   };

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Category"
            description="Are you sure you want to delete this category? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            isLoading={deleting}
         />
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
            {/* Header with Actions */}
            <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
               </div>
               <div className="flex gap-2 shrink-0">
                  <button
                     onClick={() => onEdit(category)}
                     className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                     title="Edit"
                  >
                     <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                     onClick={handleDeleteClick}
                     disabled={deleting}
                     className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                     title="Delete"
                  >
                     {deleting ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                        </svg>
                     ) : (
                        <Trash2 className="h-4 w-4" />
                     )}
                  </button>
               </div>
            </div>

            {/* Type Badge */}
            <div>
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {category.type}
               </span>
            </div>

            {/* Icon & Color */}
            <div className="space-y-3 pt-2 border-t border-border">
               {category.icon && (
                  <div>
                     <p className="text-xs text-muted-foreground mb-1">Icon</p>
                     <p className="text-lg">{category.icon}</p>
                  </div>
               )}
               {category.color && (
                  <div>
                     <p className="text-xs text-muted-foreground mb-1">Color</p>
                     <div className="flex items-center gap-2">
                        <div
                           className="w-8 h-8 rounded border border-border"
                           style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs text-muted-foreground">{category.color}</span>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}
