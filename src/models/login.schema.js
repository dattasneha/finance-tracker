import { z } from "zod";

const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .nonempty("Email is required"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export { loginSchema };