import express from "express";
import { 
  register,
  login,
  logout,
  getProfile, 
  updateProfile,
  deleteProfile,
  getAllUsers
} from "../controllers/user.controller.js";
import {authenticate,authorizeAdmin,validate} from "../middleware/user.middleware.js";
import {registerSchema,loginSchema} from "../validators/user.validator.js";
const router = express.Router();
router.post("/register", validate(registerSchema),register);
router.post("/login",validate(loginSchema), login);
router.post("/logout",authenticate, logout);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, validate(registerSchema), updateProfile);
router.delete("/profile", authenticate, deleteProfile);
router.get("/", authenticate, authorizeAdmin, getAllUsers);

export default router;
