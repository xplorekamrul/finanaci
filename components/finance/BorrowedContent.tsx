"use client";

import { getBorrowed } from "@/actions/finance/borrowed";
import { Pagination } from "@/components/shared/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { Borrowed, FinanceCategory } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import BorrowedForm from "./BorrowedForm";
import BorrowedTable from "./BorrowedTable";
import Modal from "./Modal";

interface BorrowedContentProps {
   initialBorrowed: (Borrowed & { category: FinanceCategory | null })[];
   categories: FinanceCategory[];
   initialPagination: PaginatedResponse<any>["pagination"];
}

export default function BorrowedContent({
   initialBorrowed,
   categories,
   initialPagination,
}: BorrowedContentProps) {
   const [borrowed, setBorrowed] = useState<(Borrowed & { category: FinanceCategory | null })[]>(
      initialBorrowed
   );
   const [pagination, setPagination] = useState(initialPagination);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingBorrowed, setEditingBorrowed] = useState<
      (Borrowed & { category: FinanceCategory | null }) | null
   >(null);

   const loadBorrowed = useCallback(async (page: number = 1) => {
      try {
         const result = await getBorrowed({ page });
         if (result.data) {
            const paginatedData = result.data as any;
            setBorrowed(paginatedData.data || []);
            setPagination(paginatedData.pagination || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
         }
      } catch (error) {
         console.error("Failed to load borrowed records:", error);
      }
   }, []);

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
      loadBorrowed(1);
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
         <BorrowedTable
            borrowed={borrowed}
            onEdit={handleEdit}
            onRefresh={() => loadBorrowed(pagination.page)}
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
