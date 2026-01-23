import mongoose, { Types } from "mongoose";
import { object } from "zod";
import { required } from "zod/mini";
import User from "./user.model.js";
import Cart from "./cart.model.js";
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [
            {
                Cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Cart',
                },
            }
        ],
        totalAmount: { type: Number },
        shippingAddress: {
        street: { type: String ,required:true},
        city: { type: String ,required:true},
        postalCode: { type: String,required:true },
        country: { type: String,required:true },
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
