import express from 'express';
import {
    checkOut,getmyOrders,getOrderById,getAllOrders,updateOrderStatus,cancleOrder
}from "../controllers/order.controller.js";
import { authenticate,authorizeAdmin,validate } from '../middleware/user.middleware.js';
import { orderValidator} from "../validators/order.validator.js"
const router=express.Router();
router.get("/orders",authenticate,authorizeAdmin,getAllOrders);
router.get("/orders/me",authenticate,getmyOrders);
router.get("/orders/:id",authenticate,getOrderById);
router.post("/orders",authenticate,validate(orderValidator),checkOut);
router.put("/orders/:id",updateOrderStatus);
router.delete("/orders/:id",cancleOrder);
export default router;
