"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
   if (!isOpen) return null;

   return (
      <>
         {/* Backdrop */}
         <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
         />

         {/* Modal Container */}
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            {/* Modal Content */}
            <div
               className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-border animate-in fade-in zoom-in-95 duration-300"
               onClick={(e) => e.stopPropagation()}
            >
               {/* Header with Title and Close Button */}
               <div className="sticky top-0 flex items-center justify-between p-4 bg-card border-b border-border z-10">
                  {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
                  <button
                     onClick={onClose}
                     className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground ml-auto"
                     aria-label="Close modal"
                  >
                     <X className="h-5 w-5" />
                  </button>
               </div>

               {/* Content */}
               <div className="p-6">{children}</div>
            </div>
         </div>
      </>
   );
}
