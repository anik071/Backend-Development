import express from 'express';
import {
    getCarts,
    getCart,
    createCart,updateCart,deleteCart
}from "../controllers/cart.controller.js";

const router=express.Router();

router.get("/carts",getCarts);
router.get("/carts/:id",getCart);
router.post("/carts",createCart);
router.put("/carts/:id",updateCart);
router.delete("/carts/:id",deleteCart);
export default router;