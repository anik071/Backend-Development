import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/order.model.js"
import { success } from "zod";
export const checkOut=async (req,res)=>{
    try {
        const userId=req.user._id;
        const {shippingAddress,paymentMethod}=req.body;
        const cart= await Cart.findOne({userId})
        if(!cart || cart.items.length===0){
            return res.status(400).json({
            success: false,
            message: "Cart is empty",
      });
    }
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
    const order = await Order.create({
      userId,
      items: [
        {
          Cart: cart._id,
        },
      ],
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "processing",
    });
    cart.items = [];
    await cart.save();
    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
    });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Checking Out",
            error:error.message
        });

    }
};
export const getmyOrders= async (req,res)=>{
    try {
        const Id=req.user._id;
        const order = await Order.findOne({userId:Id});
        if(!order){
            return res.status(404).json({
                success:true,
                message:"No Order Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Ordered Are Fetched Successfully",
            count:order.length,
            data:{
                order
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success:false,
            message: "Error fetching orders",
            error: error.message });
    }
   
}

export const getOrderById= async (req,res)=>{
    try {
        const oid= req.params.id;
    const order = await Order.findById(oid);
    if(!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({
        success:true,
            message:"Order is Fetched Successfully",
            data:{
                order
            }
    });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
}

export const getAllOrders=async (req,res)=>{
    try {
        const {page=1,limit=10}=req.query;
        const skip=(page-1)*limit
        const order = await Order.find()
        .skip(skip)
        .limit(Number(limit))
        .sort({createdAt:-1})
        if(!order){
            return res.status(404).json({ 
                success:false,
                message: "Order not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Orders are Fetched Successfully",
            count:order.length,
            data:{
                order
            }
        })

    } catch (error) {
        res.status(500).json({ 
            success:false,
            message: "Error fetching orders",
            error: error.message });
    }
}

export const updateOrderStatus = async (req,res)=>{
try {
    const UpdatedOrder= req.params.id;
    const {orderStat}=req.body
    if(!orderStat){
        return res.status(400).json({
            success:false,
            message:"Status not defined",
            error:error.message
        })
    }
    const order= await Order.findByIdAndUpdate(UpdatedOrder,{
        orderStatus:orderStat
    },{new:true});
    if (!order) return res.status(404).json({ 
        success:false,
        message: "Order not found"
     });
    res.status(200).json({
        success:true,
        message:"Order Status updated Successfully",
        data:{
            order
        }
    });
} catch (error) {
    res.status(500).json({
        success:false,
        message : "updating order error",
        error:error.message});
}
}

export const cancleOrder = async (req,res)=>{
try {
    const oid=req.params.id;
    const order= await Order.findByIdAndUpdate(oid,{
        orderStatus:"cancelled"
    },{new:true});
    if(!order)
        return res.status(404).json({
            success:false,
            message:"order not found",
            error:error.message
        });
    res.status(200).json({message:"Order deleted Successfully!"});
} catch (error) {
    res.status(500).json({
        success:false,
        message : "order canceling error",
        error:error.message
    });
}
}
