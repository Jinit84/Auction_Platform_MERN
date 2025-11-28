import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createPaymentOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);

export default router;