import Product from "../models/product.model.js";
import {z} from 'zod';

const productValidator = z.object({
  name: z.string().min(2, "Product name too short"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().optional()
});
export const getProducts= async(req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({message:"Error fetching products", error:error.message});
    }
}

export const getProduct= async(req,res)=>{
    try {
        const pid=req.params.id;
        const product = await Product.findById(pid);
        if(!product)return res.status(404).json({ message: "User not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message:"Error fetching products", error:error.message});
    }
}

export const createProduct= async(req,res)=>{
    try {
        const parseProduct = productValidator.parse(req.body);
        const product=await Product.create(parseProduct);
        res.status(201).json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
         res.status(500).json({message:"Error Creating products", error:error.message});
    }
}

export const updateProduct= async(req,res)=>{
    try {
        const pid=req.params.id;
        const parseProduct = productValidator.parse(req.body);
        const product = await Product.findByIdAndUpdate(pid,parseProduct,{new:true});
        if(!product)return res.status(404).json({ message: "User not found" });
        res.status(200).json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
              return res.status(400).json({ errors: error.errors });
            }
         res.status(500).json({message:"Error Updating products", error:error.message});
    }
}

export const deleteProduct= async(req,res)=>{
    try {
        const pid=req.params.id;
        const product=await Product.findByIdAndDelete(pid);
        if (!product) return res.status(404).json({ message: "product not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}