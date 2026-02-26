"use client";

import { deleteSavings } from "@/actions/finance/savings";
import { FinanceCategory, Savings } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface SavingsCardProps {
  savings: Savings & { category: FinanceCategory | null };
  onEdit: (savings: Savings & { category: FinanceCategory | null }) => void;
  onRefresh: () => void;
}

export default function SavingsCard({ savings, onEdit, onRefresh }: SavingsCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSavings({ id: savings.id });
      setDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Savings"
        description="Are you sure you want to delete this savings record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleting}
      />
      <div className="card-snake-border bg-card rounded-xl shadow-lg p-4 space-y-4">
        {/* Header with Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{savings.bankName}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(savings.savingsDate)}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit(savings)}
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

        {/* Category */}
        {savings.category && (
          <div className="flex items-center gap-2">
            {/* {savings.category.icon && <span className="text-lg">{savings.category.icon}</span>} */}
            <span className="text-sm text-muted-foreground">{savings.category.name}</span>
          </div>
        )}

        {/* Amount */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Amount</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {savings.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {savings.currency}
          </p>
        </div>

        {/* Date */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Savings Date</p>
          <p className="text-sm font-medium text-foreground">{formatDate(savings.savingsDate)}</p>
        </div>

        {/* Description */}
        {savings.description && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground line-clamp-2">{savings.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
