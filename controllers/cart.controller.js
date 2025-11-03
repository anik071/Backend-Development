import Cart from "../models/cart.model.js";
import { z } from "zod";

const cartValidator = z.object({
  userID: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  status: z.string()
});

export const getCarts = async (req,res)=>{
try {
    const cart= await Cart.find();
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({message : "fetching carts error",error:error.message});
}
}

export const getCart = async (req,res)=>{
try {
    const cid=req.params.id;
    const cart= await Cart.findById(cid);
    if(!cart)
        return res.status(404).json({message:"cart not found",error:error.message});
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({message : "fetching cart error",error:error.message});
}
}

export const createCart = async (req,res)=>{
try {
    const parse= cartValidator.parse(req.body)
    const cart= await Cart.create(parse);
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({message : "creating carts error",error:error.message});
}
}

export const updateCart = async (req,res)=>{
try {
    const upcart= req.params.id;
    const parse= cartValidator.parse(req.body)
    const cart= await Cart.findByIdAndUpdate(upcart,parse,{new:true});
    if (!cart) return res.status(404).json({ message: "cart not found" });
    res.status(200).json(cart);
} catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({message : "updating carts error",error:error.message});
}
}

export const deleteCart = async (req,res)=>{
try {
    const cid=req.params.id;
    const cart= await Cart.findByIdAndDelete(cid);
    if(!cart)
        return res.status(404).json({message:"cart not found",error:error.message});
    res.status(200).json({ message: "cart deleted successfully" });
} catch (error) {
    res.status(500).json({message : "deleting cart error",error:error.message});
}
}
