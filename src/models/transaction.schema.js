import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0"),

  type: z
  .enum(["INCOME", "EXPENSE"]),

  category: z
    .string()
    .min(2, "Category must be at least 2 characters"),

  notes: z
    .string()
    .max(200)
    .optional(),

  date: z
   .string()
    .date()
});