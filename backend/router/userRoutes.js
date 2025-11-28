import express from "express";
import {
  deleteUser,
  getAllUsers,
  getProfile,
  getSingleUser,
  login,
  logout,
  register,
  updateProfile,
  updateUserRole,
  requestOTP,
  verifyLoginOTP,
  fetchLeaderboard,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.route("/login/request-otp").post(requestOTP);
router.route("/login/verify-otp").post(verifyLoginOTP);

// Legacy login (kept for backward compatibility)
router.route("/login").post(login);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/leaderboard", fetchLeaderboard);

// Admin routes
router.route("/admin/user/:id").put(isAuthenticated, isAuthorized("admin"), updateUserRole);

export default router;
