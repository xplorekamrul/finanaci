import * as z from "zod";

const dateOrEmptyString = z.union([
   z.string().length(0).transform(() => null),
   z.string().transform((val) => (val ? new Date(val) : null)),
   z.date(),
]).nullable().optional();

const requiredDate = z.union([
   z.string().transform((val) => new Date(val)),
   z.date(),
]);

export const borrowedSchema = z.object({
   lenderName: z.string().min(1, "Lender name is required").max(100, "Max 100 characters"),
   amount: z.number().positive("Amount must be greater than 0"),
   currency: z.string().default("BDT"),
   borrowDate: requiredDate,
   returnDate: dateOrEmptyString,
   actualReturnDate: dateOrEmptyString,
   interest: z.number().min(0, "Interest cannot be negative").default(0),
   description: z.string().optional().nullable(),
   status: z.enum(["PENDING", "RETURNED", "OVERDUE"]).default("PENDING"),
   categoryId: z.string().optional().nullable(),
});

export type BorrowedValues = z.infer<typeof borrowedSchema>;
