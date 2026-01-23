import z from "zod";

export const productValidator = z.object({
  name: z.string().min(2, "Product name too short"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().optional(),
  description: z.string().optional(),
  isAvailable: z.coerce.boolean().default(true),
  imageUrl: z.string().optional()
});