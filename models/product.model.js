import mongoose from "mongoose";
import { required } from "zod/mini";

const productSchema= new mongoose.Schema(
    {
        name:{type: String, required:true},
        price:{type:Number,required:true},
        description:{type:String,required:true},
        category:{type: String,required:true},
        stock:{type: Number,default:1},
        isAvailable:{type: Boolean, default:true},
        imageUrl:{type:String},
    },{
        timestamps:true,
    }
);
export default mongoose.model("Product",productSchema);
