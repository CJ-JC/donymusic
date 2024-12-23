import express from "express";
import { createUser, loginUser } from "../controllers/user.js";

const router = express.Router();

// router.get("/", getUsers);

router.post("/signin", loginUser);

router.post("/signup", createUser);

export default router;
