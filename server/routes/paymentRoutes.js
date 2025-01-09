import express from "express";
import { checkUserPurchase, createCheckoutSession, getPurchases, verifyPayment } from "../controllers/paymentController.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/get-purchases", getPurchases);

router.get("/check-purchase", checkAuth, checkUserPurchase);

router.post("/create-checkout-session", checkAuth, createCheckoutSession);

router.get("/verify", checkAuth, verifyPayment);

export default router;
