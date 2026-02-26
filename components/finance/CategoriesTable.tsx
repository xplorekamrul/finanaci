"use client";

import { deleteFinanceCategory } from "@/actions/finance/categories";
import { FinanceCategory } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import CategoryCard from "./CategoryCard";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface CategoriesTableProps {
   categories: FinanceCategory[];
   onEdit: (category: FinanceCategory) => void;
   onRefresh: () => void;
}

export default function CategoriesTable({ categories, onEdit, onRefresh }: CategoriesTableProps) {
   const [deleting, setDeleting] = useState<string | null>(null);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [deleteId, setDeleteId] = useState<string | null>(null);

   const handleDeleteClick = (id: string) => {
      setDeleteId(id);
      setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = async () => {
      if (!deleteId) return;

      setDeleting(deleteId);
      try {
         await deleteFinanceCategory({ id: deleteId });
         setDeleteDialogOpen(false);
         setDeleteId(null);
         onRefresh();
      } catch (error) {
         console.error("Delete error:", error);
      } finally {
         setDeleting(null);
      }
   };

   if (categories.length === 0) {
      return (
         <div className="card-snake-border bg-card rounded-xl shadow-lg p-8 text-center text-muted-foreground">
            No categories found. Create one to get started.
         </div>
      );
   }

   return (
      <>
         <DeleteConfirmDialog
            isOpen={deleteDialogOpen}
            title="Delete Category"
            description="Are you sure you want to delete this category? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={() => {
               setDeleteDialogOpen(false);
               setDeleteId(null);
            }}
            isLoading={deleting === deleteId}
         />
         {/* Mobile Cards View */}
         <div className="md:hidden grid grid-cols-1 gap-4">
            {categories.map((category) => (
               <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={onEdit}
                  onRefresh={onRefresh}
               />
            ))}
         </div>

         {/* Desktop Table View */}
         <div className="hidden md:block card-snake-border bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur shadow-sm">
                     <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Icon
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                           Color
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {categories.map((category, idx) => (
                        <tr
                           key={category.id}
                           className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                              } hover:bg-primary/10`}
                        >
                           <td className="px-6 py-4 text-sm text-foreground font-medium">{category.name}</td>
                           <td className="px-6 py-4 text-sm">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                 {category.type}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-foreground">{category.icon || "-"}</td>
                           <td className="px-6 py-4 text-sm">
                              {category.color ? (
                                 <div className="flex items-center gap-2">
                                    <div
                                       className="w-6 h-6 rounded border border-border"
                                       style={{ backgroundColor: category.color }}
                                    />
                                    <span className="text-xs text-muted-foreground">{category.color}</span>
                                 </div>
                              ) : (
                                 "-"
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button
                                    onClick={() => onEdit(category)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                    title="Edit"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(category.id)}
                                    disabled={deleting === category.id}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive disabled:opacity-50"
                                    title="Delete"
                                 >
                                    {deleting === category.id ? (
                                       <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                          <circle
                                             className="opacity-25"
                                             cx="12"
                                             cy="12"
                                             r="10"
                                             stroke="currentColor"
                                             strokeWidth="4"
                                          />
                                          <path
                                             className="opacity-75"
                                             fill="currentColor"
                                             d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                                          />
                                       </svg>
                                    ) : (
                                       <Trash2 className="h-4 w-4" />
                                    )}
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
}
