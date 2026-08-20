import { z } from "zod";

export const petSchema = z.object({
  id: z.number().int(),

  name: z.string().min(1, "Name is required").max(20, "Name cannot exceed 20 characters"),

  species: z.enum(["Dog", "Cat"], {
    message: "This field is required."
  }),

  breed: z.string().max(50, "Breed cannot exceed 50 characters").optional().nullable(),

  gender: z.enum(["Male", "Female"], {
    message: "This field is required."
  }),

  isNeutered: z.boolean().default(false),

  weight: z.number().positive("Weight must be a positive number"),

  microchipNumber: z.string()
    .regex(/^\d{15}$/, "Microchip must be exactly 15 digits")
    .or(z.literal(""))
    .optional()
    .nullable(),
    
  ownerId: z.number().int().positive()
});


export type Pet = z.infer<typeof petSchema>;
export const petFormSchema = petSchema.omit({ id: true });
export type PetData = z.infer<typeof petFormSchema>;