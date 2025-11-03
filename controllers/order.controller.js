import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { z } from "zod";

const orderValidator = z.object({
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
  shippingAddress:z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string()}),
  paymentMethod: z.string(),
  paymentStatus:z.string().default("pending"),
  orderStatus:z.string().default("processing"),
  orderDate: z.preprocess((arg) => arg ? new Date(arg) : new Date(), z.date())
});

export const getOrders= async (req,res)=>{
    try {
    const order = await Order.find();
    res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
   
}

export const getOrder= async (req,res)=>{
    try {
        const oid= req.params.id;
    const order = await Order.findById(oid);
    if(!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
}

export const createOrder= async (req,res)=>{
    try {
        const parse= orderValidator.parse(req.body)
    const order = await Order.create(parse);
    res.status(200).json(order);
    } catch (error) {
         if (error instanceof z.ZodError) {
      
      return res.status(400).json({ errors: error.errors });
    }
        res.status(500).json({ message: "Error creating orders", error: error.message });
    }
   
}
export const updateOrder = async (req,res)=>{
try {
    const UpdatedOrder= req.params.id;
    const parse= orderValidator.parse(req.body)
    const order= await Order.findByIdAndUpdate(UpdatedOrder,parse,{new:true});
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
} catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({message : "updating order error",error:error.message});
}
}

export const deleteOrder = async (req,res)=>{
try {
    const oid=req.params.id;
    const order= await Order.findByIdAndDelete(oid);
    if(!order)
        return res.status(404).json({message:"order not found",error:error.message});
    res.status(200).json({message:"Order deleted Successfully!"});
} catch (error) {
    res.status(500).json({message : "deleting order error",error:error.message});
}
}
