import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Cart from "./cart.model.js";
const userSchema =new mongoose.Schema(
    {
        name:{ type: String,required:true},
        username:{ type: String, required:true,unique:true},
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
        cartId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
},{
    timestamps:true,
}
);
userSchema.pre('save',async function(){
    if(!this.isModified('password'))return;
    this.password=await bcrypt.hash(this.password,await bcrypt.genSalt(10));
});
userSchema.methods.comparePassword=async function (enteredPass) {
    return await bcrypt.compare(enteredPass,this.password);
}
userSchema.pre('findOneAndUpdate',async function(){
    const update=this.getUpdate();
    if(update.password){
        update.password=await bcrypt.hash(update.password,await bcrypt.genSalt(10));
    }
})
export default mongoose.model("User",userSchema);
