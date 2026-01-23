import { z } from "zod";

export const addToCartValidator = z.object({
  productId: z.string(),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be greater than 0"),
});

export const removeFromCartValidator = z.object({
  productId: z.string(),
});
