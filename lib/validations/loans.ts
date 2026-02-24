import * as z from "zod";

export const loanSchema = z.object({
   personName: z.string().min(1, "Person name is required").max(100, "Max 100 characters"),
   amount: z
      .union([z.number(), z.string()])
      .refine((val) => {
         const num = typeof val === "string" ? parseFloat(val) : val;
         return !isNaN(num) && num > 0;
      }, "Amount must be greater than 0")
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
   currency: z.string().default("BDT"),
   loanDate: z
      .union([z.date(), z.string()])
      .refine((val) => {
         if (val instanceof Date) return true;
         return !isNaN(Date.parse(val as string));
      }, "Invalid date")
      .transform((val) => (val instanceof Date ? val : new Date(val as string))),
   returnDate: z
      .union([z.date(), z.string(), z.null()])
      .optional()
      .refine((val) => {
         if (!val || val === null) return true;
         if (val instanceof Date) return true;
         return !isNaN(Date.parse(val as string));
      }, "Invalid date")
      .transform((val) => {
         if (!val || val === null) return null;
         return val instanceof Date ? val : new Date(val as string);
      }),
   description: z.string().optional().nullable(),
   status: z.enum(["PENDING", "RETURNED", "OVERDUE"]).default("PENDING"),
   categoryId: z.string().min(1, "Category is required"),
});

export type LoanValues = z.infer<typeof loanSchema>;
