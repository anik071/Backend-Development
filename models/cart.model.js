import mongoose from "mongoose";
import { string } from "zod";
import { required } from "zod/mini";
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
        totalPrice:{type:Number,required:true},
        status: {
            type:string,
            enum:["active","ordered","cancelled"],
            required:true,
        }
    },
    { timestamps:true}
);

export default mongoose.model("Cart",cartSchema);