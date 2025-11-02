import mongoose from "mongoose";
const userSchema =new mongoose.Schema(
    {
        name:{ type: String,required:true},
        email:{ type: String, required:true,unique:true},
        age:{ type: Number, required:true},
        password:{ type:String, required:true},
        address: {
            street:String,
            city:String,
            country:String,
        },
        role:{type:String ,enum:["user","admin"],default:"user"},
        isActive: { type: Boolean, default: true },
        hobbies: [{ type: String }],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
},{
    timestamps:true,
}
);
export default mongoose.model("User",userSchema);
