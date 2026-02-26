"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteConfirmDialogProps {
   isOpen: boolean;
   title: string;
   description: string;
   onConfirm: () => void;
   onCancel: () => void;
   isLoading?: boolean;
}

export function DeleteConfirmDialog({
   isOpen,
   title,
   description,
   onConfirm,
   onCancel,
   isLoading = false,
}: DeleteConfirmDialogProps) {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/50"
            onClick={onCancel}
         />

         {/* Dialog */}
         <div className="relative bg-card rounded-lg shadow-lg p-6 max-w-sm mx-4 border border-border">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10">
               <AlertCircle className="w-6 h-6 text-destructive" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-foreground text-center mb-2">
               {title}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground text-center mb-6">
               {description}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
               <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
               >
                  Cancel
               </Button>
               <Button
                  variant="destructive"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2"
               >
                  {isLoading && (
                     <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                     </svg>
                  )}
                  {isLoading ? "Deleting..." : "Delete"}
               </Button>
            </div>
         </div>
      </div>
   );
}
