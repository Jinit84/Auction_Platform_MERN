import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Auction } from "../models/auctionSchema.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Amount is required", 400));
  }

  const options = {
    amount: Number(amount) * 100, // Razorpay works in subunits (paise), so multiply by 100
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, auctionId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update the auction status to Paid
    const auction = await Auction.findById(auctionId);
    if (auction) {
        auction.isPaid = true;
        await auction.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } else {
    return next(new ErrorHandler("Payment verification failed", 400));
  }
});