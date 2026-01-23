import { z } from "zod";

export const orderValidator = z.object({
  userId: z.string().optional(),

  items: z.array(
    z.object({
      Cart: z.string().optional(),
    })),

  totalAmount: z.coerce.number().positive("Total amount must be positive"),

  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),

  paymentMethod: z.enum(["card", "cash on delivery"]),

  paymentStatus: z.enum(["pending", "paid", "failed"]).default("pending"),

  orderStatus: z.enum(["processing", "shipped", "delivered", "cancelled"])
    .default("processing"),

  orderDate: z.coerce.date().optional(),
});
