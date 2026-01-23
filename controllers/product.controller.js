import Product from "../models/product.model.js";
import {z} from 'zod';

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
        const {keyword = "",category,minPrice,maxPrice,page = 1,limit = 10} = req.query;
        let query = {};
        if(keyword){
            query.$or=[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }
        if(category){
            query.category=category
        }
        if(minPrice || maxPrice){
            query.price={};
            if(minPrice)query.price.$gte = Number(minPrice);
            if(maxPrice)query.price.$lte = Number(maxPrice);
        }
        const skip =(page-1)*limit;
        const products=await Product.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({createdAt:-1})
        const total = await Product.countDocuments(query);
        res.status(200).json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data:{products}
        });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product search failed",
      error: error.message
    });
  }
};
export const createProduct= async(req,res)=>{
    try {
        const {name,price,description,category,stock,isAvailable,imageUrl}=req.body;
        const prod={
            name : name,
            price : price,
            description:description,
            category:category,
            stock:stock || 1,
            isAvailable: isAvailable || true
        }
        if(imageUrl){
            prod.imageUrl=imageUrl
        }
        const product=await Product.create({prod})
        res.status(201).json({
        success: true,
        message: "Product created successfully",
        data:{
            prod
        }
    });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Product Create failed",
        error: error.message
    });
    }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Product Create failed",
        error: error.message
    });
    }
}

export const deleteProduct= async(req,res)=>{
    try {
        const pid=req.params.id;
        const product=await Product.findByIdAndDelete(pid);
        if (!product) return res.status(404).json({ message: "product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}
