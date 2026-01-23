import express from 'express';
import {
    getCarts,
    getCart,
    addToCart,clearCart,removeFromCart
}from "../controllers/cart.controller.js";
import { authenticate,authorizeAdmin,validate } from '../middleware/user.middleware.js';
import { addToCartValidator ,removeFromCartValidator} from "../validators/cart.validator.js"
const router=express.Router();

router.get("/carts",authenticate,authorizeAdmin,getCarts);
router.get("/cart",authenticate,getCart);
router.post("/carts/add",authenticate,validate(addToCartValidator),addToCart);
router.post("/carts/rem",authenticate,validate(removeFromCartValidator),removeFromCart);
router.post("/carts/clear",authenticate,clearCart);
export default router;
