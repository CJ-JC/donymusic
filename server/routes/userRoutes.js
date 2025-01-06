import express from "express";
import { getUsers, loginUser, logoutUser, updateUser, getUserProfile, registerUser } from "../controllers/user.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/profile/:id", getUserProfile);

router.put("/:id", updateUser);

router.post("/signin", loginUser);

router.post("/signup", registerUser);

router.post("/logout", logoutUser);

router.get("/check-auth", checkAuth);

export default router;
