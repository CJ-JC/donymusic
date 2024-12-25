import express from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

// router.get("/", getUsers);

router.post("/signin", loginUser);

router.post("/signup", createUser);

router.post("/logout", logoutUser);

router.get("/check-auth", checkAuth);

export default router;
