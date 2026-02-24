"use client";

import { Borrowed, FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import BorrowedForm from "./BorrowedForm";
import BorrowedTable from "./BorrowedTable";
import Modal from "./Modal";

interface BorrowedContentProps {
   initialBorrowed: (Borrowed & { category: FinanceCategory | null })[];
   categories: FinanceCategory[];
}

export default function BorrowedContent({ initialBorrowed, categories }: BorrowedContentProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingBorrowed, setEditingBorrowed] = useState<
      (Borrowed & { category: FinanceCategory | null }) | null
   >(null);

   const handleRefresh = () => {
      window.location.reload();
   };

   const handleEdit = (item: Borrowed & { category: FinanceCategory | null }) => {
      setEditingBorrowed(item);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingBorrowed(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      handleRefresh();
   };

   return (
      <div className="space-y-6">
         {/* Header with Add Button */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-foreground">Borrowed Records</h2>
               <p className="text-sm text-muted-foreground">Manage your borrowed money records</p>
            </div>
            <button
               onClick={() => {
                  setEditingBorrowed(null);
                  setIsModalOpen(true);
               }}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
               <Plus className="h-4 w-4" />
              
            </button>
         </div>

         {/* Borrowed Table */}
         <BorrowedTable borrowed={initialBorrowed} onEdit={handleEdit} onRefresh={handleRefresh} />

         {/* Modal for Create/Edit */}
         <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingBorrowed ? "Edit Borrowed Record" : "Add Borrowed Record"}
         >
            <BorrowedForm
               borrowed={editingBorrowed || undefined}
               categories={categories}
               onSuccess={handleSuccess}
               onCancel={handleCloseModal}
            />
         </Modal>
      </div>
   );
}
