import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"
export const getCarts = async (req,res)=>{
try {
    const cart= await Cart.find().sort({createdAt:-1});
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({message : "fetching carts error",error:error.message});
}
}

export const getCart = async (req,res)=>{
try {
    const id=req.user._id;
    const cart=await Cart.findOne({userID:id})
    .populate({
        path: "userID",
        select: "name"
      })
    .populate({
        path: "items.productId",
        select: "name price images stock"
    });
    if(!cart){
        return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }
    const totalPrice= cart.items.reduce((sum,item)=>{
        if(!item.productId)return sum
        return sum + item.productId.price * item.quantity;
    },0)
    cart.totalPrice=totalPrice;
    await cart.save();
    res.status(200).json({
      success: true,
      cart
    });
}catch(error){
    res.status(500).json({
      success: false,
      message: "Cart Fetching Unsuccessfull",
      error: error.message
    });
}
}

export const addToCart=async (req,res)=>{
    try {
        const userId=req.user._id;
        const {productId,quantity}=req.body;
        const product= await Product.findById(productId);
        if(!product){
            return res.status(404).json({
        success: false,
        message: "Product not found"
      });
        }
        if (product.stock < quantity) {
        return res.status(400).json({
            message: "Insufficient stock" 
        });
        }
        if (quantity <= 0) {
        return res.status(400).json({
            message: "Invalid quantity"
        });
}

        let cart = await Cart.findOne({ userID: userId});
        if (!cart) {
        cart = await Cart.create({
        userID: userId,
        items: []
      });
    }
    const idx=cart.items.findIndex(
      item => item.productId.toString() === productId
    );
        if (idx > -1) {
        cart.items[idx].quantity += quantity;
        }else {
        cart.items.push({ productId, quantity });
    }
    let total = 0;
    for (const item of cart.items) {
     const p = await Product.findById(item.productId);
    if (p) {
    total += p.price * item.quantity;
  }
}
    cart.totalPrice = total;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Add to cart Unsuccessfull",
        error: error.message
    });
    }
}

export const removeFromCart=async (req,res)=>{
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({userID: userId}).populate("items.productId");
        if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    cart.items = cart.items.filter(
      item => item.productId && item.productId._id.toString() !== productId
    );
    let total = 0;
    for (const item of cart.items) {
     const p = await Product.findById(item.productId);
    if (p) {
    total += p.price * item.quantity;
  }
}
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart
    });
    } catch (error) {
         res.status(500).json({
      success: false,
      message: "remove from cart Unsuccessfull",
      error: error.message
    });
    }
}

export const clearCart = async (req,res)=>{
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({userID: userId});
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
    } catch (error) {
         res.status(500).json({
      success: false,
      message: "Clearing cart Unsuccessfull",
      error: error.message
    });
    }
}
