"use client";

import { getSavings } from "@/actions/finance/savings";
import { FinanceCategory, Savings } from "@prisma/client";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import Modal from "./Modal";
import SavingsForm from "./SavingsForm";
import SavingsTable from "./SavingsTable";

interface SavingsContentProps {
   initialCategories: FinanceCategory[];
   initialSavings: (Savings & { category: FinanceCategory | null })[];
}

export default function SavingsContent({
   initialCategories,
   initialSavings,
}: SavingsContentProps) {
   const [savings, setSavings] = useState<(Savings & { category: FinanceCategory | null })[]>(
      initialSavings
   );
   const [editingSavings, setEditingSavings] = useState<
      (Savings & { category: FinanceCategory | null }) | null
   >(null);
   const [showModal, setShowModal] = useState(false);

   const loadSavings = useCallback(async () => {
      try {
         const result = await getSavings();
         if (result.data) setSavings(result.data);
      } catch (error) {
         console.error("Failed to load savings:", error);
      }
   }, []);

   const handleCloseModal = () => {
      setShowModal(false);
      setEditingSavings(null);
   };

   const handleSuccess = () => {
      handleCloseModal();
      loadSavings();
   };

   return (
      <div className="space-y-6">
         {/* Header with Add Button */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-foreground">Bank Savings</h2>
               <p className="text-sm text-muted-foreground">Track your bank savings and deposits</p>
            </div>
            <button
               onClick={() => {
                  setEditingSavings(null);
                  setShowModal(true);
               }}
               disabled={initialCategories.length === 0}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Plus className="h-4 w-4" />
            </button>
         </div>

         {/* Warning if no categories */}
         {initialCategories.length === 0 && (
            <div className="card-snake-border bg-card rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
               <p className="text-sm text-muted-foreground">
                  Create a category first before adding savings.
               </p>
            </div>
         )}

         {/* Savings Table */}
         <SavingsTable
            savings={savings}
            onEdit={(saving) => {
               setEditingSavings(saving);
               setShowModal(true);
            }}
            onRefresh={loadSavings}
         />

         {/* Modal for Create/Edit */}
         <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            title={editingSavings ? "Edit Savings" : "Add Savings"}
         >
            <SavingsForm
               categories={initialCategories}
               initialData={editingSavings}
               onClose={handleCloseModal}
               onSuccess={handleSuccess}
            />
         </Modal>
      </div>
   );
}
