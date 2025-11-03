import mongoose, { Types } from "mongoose";
import { object } from "zod";
import { required } from "zod/mini";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true, default: 0.0 }
            }
        ],
        totalAmount: { type: Number, required: true },
        shippingAddress: {
        street: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String }
        },
        paymentMethod: {
            type: String,
            enum: ["card", "cash on delivery"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered", "cancelled"],
            default: "processing",
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },

    },
    {timestamps:true}
);

export default mongoose.model("Order", orderSchema);
