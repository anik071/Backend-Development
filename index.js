import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../backend mid/routes/user.route.js";
import productRoute from "../backend mid/routes/product.route.js";
import orderRoute from "../backend mid/routes/order.route.js";
import cartRoute from "../backend mid/routes/cart.route.js";
import cookieParser from "cookie-parser";


const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api",userRoute);
app.use("/api",productRoute);
app.use("/api",orderRoute);
app.use("/api",cartRoute);


const port=process.env.PORT || 8000;
app.get("/",(req,res)=>{
    res.send("Welcome to Our Backend");
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB is connected Successfully");
})
.catch((error)=>{
    console.log(error);
})

app.listen(port,()=>{
    console.log(`server is running in http://localhost:${port}`);
})
