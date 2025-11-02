import mongoose from "mongoose";

const productSchema= new mongoose.Schema(
    {
        name:{type: String, required:true},
        price:{type:Number,required:true},
        description:{type:String,required:false},
        category:{type: String},
        stock:{type: Number},
        isAvailable:{type: Boolean, default:true},
        imageUrl:{type:String},
    },{
        timestamps:true,
    }
);
export default mongoose.model("Product",productSchema);