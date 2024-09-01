import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/test",(req,res)=>{
  res.send("Hello this is test route");
});

router.post("/logout", logout);

export default router;
