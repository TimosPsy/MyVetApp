import { z } from "zod";


export const ownerRegisterSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .min(2, "Username must be between 2 and 50 characters"),

  email: z.email({ message: "Invalid email address" }),

  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W)^.{8,}$/,
      "Password must contain at least one uppercase, one lowercase, one digit, and one special character"
    ),

  firstname: z.string()
    .min(1, "Firstname is required")
    .min(2, "Firstname must be between 2 and 50 characters"),

  lastname: z.string()
    .min(1, "Lastname is required")
    .min(2, "Lastname must be between 2 and 50 characters"),

  phoneNumber: z.string()
    .min(1, "Phone number is required"),

  vatNumber: z.string()
    .min(1, "Vat Number field is required")
    .regex(/^\d{9}$/, "Vat Number must be exactly 9 digits and contain only digits"),

  roleId: z.coerce.number().int().positive()
});

export type OwnerRegisterData = z.infer<typeof ownerRegisterSchema>;


export const ownerReadOnlySchema = z.object({
  id: z.number().int().positive(),
  
  username: z.string(),
  
  email: z.email(), 
  
  firstname: z.string(),
  
  lastname: z.string(),
  
  userRole: z.string(),

  ownerId: z.number().int()
});

export type UserReadOnly = z.infer<typeof ownerReadOnlySchema>;

