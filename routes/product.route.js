import express from "express";
import{
    getProducts,getProduct,createProduct,updateProduct,deleteProduct
} from "../controllers/product.controller.js";
import { authenticate,authorizeAdmin, validate } from "../middleware/user.middleware.js";
import {productValidator} from "../validators/product.validator.js"

const router=express.Router();
router.get("/product",authenticate,getProduct);
router.get("/products",authenticate,authorizeAdmin,getProducts);
router.post("/products",authenticate,authorizeAdmin,validate(productValidator),createProduct);
router.put("/products/:id",authenticate,authorizeAdmin,validate(productValidator),updateProduct);
router.delete("/products/:id",authenticate,authorizeAdmin,deleteProduct);

export default router;
