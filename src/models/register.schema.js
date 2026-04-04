import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required." })
      .min(2, "Name must be at least 2 characters long."),
    email: z
      .email("Invalid email address.")
      .nonempty("Email is required"),
    password: z
      .string({ required_error: "Password is required." })
      .min(6, "Password must be at least 6 characters long."),
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional()  
  });

export { registerSchema };
