import express from "express";
import { register } from "../../api/controllers/auth.js";
import { login } from "../../api/controllers/auth.js";
const router=express.Router();


router.post("/register",register);
router.post("/login",login);
export default router;