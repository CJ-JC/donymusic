import express from "express";
import { createCheckoutSession, getPurchases, getUserPurchases, verifyPayment } from "../controllers/paymentController.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get-purchases", getPurchases);

router.get("/user-purchases", checkAuth, getUserPurchases);

router.post("/create-checkout-session", checkAuth, createCheckoutSession);

router.get("/verify", checkAuth, verifyPayment);

export default router;
