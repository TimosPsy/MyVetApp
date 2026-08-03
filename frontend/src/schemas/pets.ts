import { z } from "zod";

export const petSchema = z.object({
  id: z.number().int(),

  name: z.string().min(1, "Name is required").max(20, "Name cannot exceed 20 characters"),

  species: z.string()
    .min(1, "Species is required")
    .refine((val): val is "Dog" | "Cat" => val === "Dog" || val === "Cat", {
      message: "Species must be either Dog or Cat",
    }),

  breed: z.string().max(50, "Breed cannot exceed 50 characters").optional().nullable(),

  gender: z.string()
    .min(1, "Gender is required")
    .refine((val): val is "Male" | "Female" => val === "Male" || val === "Female", {
      message: "Gender must be either Male or Female",
    }),

  isNeutered: z.boolean().default(false),

  weight: z.number().positive("Weight must be a positive number").optional().nullable(),

  microchipNumber: z.string()
    .regex(/^\d{15}$/, "Microchip must be exactly 15 digits")
    .optional()
    .nullable()
    .or(z.literal("")), // Allows empty string from form inputs
    
  ownerId: z.number().int().positive()
});


export type Pet = z.infer<typeof petSchema>;
export const petFormSchema = petSchema.omit({ id: true });
export type PetData = z.infer<typeof petFormSchema>;