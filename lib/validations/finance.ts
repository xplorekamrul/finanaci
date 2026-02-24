import { Frequency, TransactionType } from "@prisma/client";
import * as z from "zod";

export const financeCategorySchema = z.object({
   name: z.string().min(1, "Category name is required").max(50, "Max 50 characters"),
   type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], {
      message: "Please select a valid type",
   }),
   icon: z.string().optional().nullable(),
   color: z.string().optional().nullable(),
});

export type FinanceCategoryValues = z.infer<typeof financeCategorySchema>;

export const transactionSchema = z.object({
   type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], {
      message: "Please select a valid type",
   }),
   title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
   description: z.string().optional().nullable(),
   amount: z
      .union([z.number(), z.string()])
      .refine((val) => {
         const num = typeof val === "string" ? parseFloat(val) : val;
         return !isNaN(num) && num > 0;
      }, "Amount must be greater than 0")
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
   currency: z.string().default("BDT"),
   date: z
      .union([z.date(), z.string()])
      .refine((val) => {
         if (val instanceof Date) return true;
         return !isNaN(Date.parse(val as string));
      }, "Invalid date")
      .transform((val) => (val instanceof Date ? val : new Date(val as string))),
   isRecurring: z.boolean().default(false),
   frequency: z
      .enum([Frequency.DAILY, Frequency.WEEKLY, Frequency.MONTHLY, Frequency.YEARLY])
      .optional()
      .nullable(),
   categoryId: z.string().min(1, "Category is required"),
});

export type TransactionValues = z.infer<typeof transactionSchema>;
