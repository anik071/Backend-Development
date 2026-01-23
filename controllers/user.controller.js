import User from "../models/user.model.js";
import Cart from "../models/cart.model.js"
import { success, z } from "zod";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv, { configDotenv } from "dotenv";
configDotenv();
const generateToken=(userId)=>{
    return  jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});
}

export const register=async(req,res)=>{
  try {
      const {username,email}=req.body;
      const exist=await User.findOne({
        $or :[{email:email.toLowerCase()},{username:username.toLowerCase()}]
      });
      if(exist) {
        return res.status(409).json({
          success:false,
          message:exist.username===username?"Username Already Taken":"Email Already Registered"
        });
      }
      const user_body={
        name:req.body.name,
        username,
        email,
        age:req.body.age,
        password:req.body.password,
        role:req.body.role||user,
        isActive:req.body.isActive||true,
      }
      if (req.body.address) {
  user_body.address = req.body.address;
}
  const user=await User.create(user_body);
  const cart=await Cart.create({
    userID:user._id,
    items:[]
  });
  const token = generateToken(user._id);
  res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:'Strict',
    maxAge: 7*24*60*60*1000
  });
  res.status(201).json({
    success:true,
            message:"User Registered Successfully",
            data:{
                user:{
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
  })
  } catch (error) {
     res.status(500).json({
            success:false,
            message:"Error registering user",
            error:error.message
        });
  }
}

export const login=async (req,res)=>{
  try {
    const {identifier,password}=req.body;
    const user= await User.findOne({
      $or :[{email:identifier.toLowerCase()},{username:identifier.toLowerCase()}]
    });
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found with this email or username"
      });
    }
    const match=await user.comparePassword(password);
    if(!match){
      return res.status(401).json({
        success:false,
        message:"Invalid Password"
      });
    }
    const token=generateToken(user._id);
    res.cookie('token',token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==='Production',
      sameSite:'strict',
      maxAge:7*24*60*60*1000
    });
    res.status(200).json({
      success:true,
            message:'Login Successful',
            data:{
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    role:user.role
                },
                token
            }
    });
  } catch (error) {
     res.status(500).json({
            success:false,
            message:"Error Logging in",
            error:error.message
        });
  }
  
};

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token'),
        res.status(200).json({
            success:true,
            message:'Logged Out Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const getProfile=async(req,res)=>{
    try {
        res.status(200).json({
            success:true,
            data:{
                user:req.user
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const updateProfile=async(req,res)=>{
     try {
        const updatedData= {
                name:req.body.name,
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                role:req.body.role||'user',
                isActive:req.body.isActive||true
            }
if (req.body.address) {
    updatedData.address = req.body.address;
}
         const user=await User.findByIdAndUpdate(
            req.user._id,
            updatedData
           ,
            {new:true,runValidators:true}
        );
        res.status(200).json({
            success:true,
            message:"User Updated Successfully",
            data:{user}
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};

export const deleteProfile=async(req,res)=>{
    try {
         const cart=await Cart.findOne({userID:req.user._id});
        await Cart.findByIdAndDelete(cart._id)
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const getAllUsers=async (req,res)=>{
    try {
        const users=await User.find().sort({createdAt: -1});
        res.status(200).json({
            success:true,
            count:users.length,
            data:{users}
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
}
