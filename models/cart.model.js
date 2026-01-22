import mongoose from "mongoose";
import { string } from "zod";
import { required } from "zod/mini";
import User from "./user.model.js";
import Product from "./product.model.js";
const cartSchema = new mongoose.Schema(
    {
        userID: {
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
                        
                    }
                ],
        totalPrice:{type:Number,default:0},
        status: {
            type:String,
            enum:["active","ordered","cancelled"],
            default:"active"
        }
    },
    { timestamps:true}
);

export default mongoose.model("Cart",cartSchema);
