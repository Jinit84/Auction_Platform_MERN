import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { generateOTP, sendOTP, verifyOTP } from "../utils/otpUtils.js";
import bcrypt from 'bcrypt';

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required.", 400));
  }

  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    razorpayAccountId,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(
        new ErrorHandler("Please provide your full bank details.", 400)
      );
    }
    if (!razorpayAccountId) {
      return next(
        new ErrorHandler("Please provide your razorpay account ID.", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your paypal email.", 400));
    }
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload profile image to cloudinary.", 500)
    );
  }
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      razorpay: {
        razorpayAccountId,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  generateToken(user, "User Registered.", 201, res);
});

export const requestOTP = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required.", 400));
    }

    // Find user with optimized query
    const user = await User.findOne({ email }).select("+password").lean();
    if (!user) {
      return next(new ErrorHandler("Invalid credentials.", 400));
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid credentials.", 400));
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP (direct update without fetching the document first)
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          'otp.code': otp,
          'otp.expiresAt': otpExpiry
        } 
      }
    );

    // Return response immediately without waiting for email
    res.status(200).json({
      success: true,
      message: `OTP generated successfully.`,
      userId: user._id,
      otp: otp // Always include OTP in response for development
    });

    // Send email in background (non-blocking)
    if (process.env.NODE_ENV === 'production') {
      sendOTP(email, otp).catch(console.error);
    } else {
      // In development, just log it
      console.log('OTP for', email, ':', otp);
    }
    
  } catch (error) {
    console.error('Error in requestOTP:', error);
    return next(new ErrorHandler('Failed to process OTP request', 500));
  }
});

export const verifyLoginOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required.", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Verify OTP
  if (!user.otp || !user.otp.code) {
    return next(new ErrorHandler("No OTP found. Please request a new one.", 400));
  }
  
  // Check if OTP is expired
  const now = new Date();
  if (now > user.otp.expiresAt) {
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("OTP has expired. Please request a new one.", 400));
  }
  
  // Check if OTP matches
  if (user.otp.code !== otp) {
    return next(new ErrorHandler("Invalid OTP. Please try again.", 400));
  }

  // Clear OTP after successful verification
  user.otp = undefined;
  await user.save({ validateBeforeSave: false });

  // Generate token and log in
  generateToken(user, "Login successful!", 200, res);
});

// Keep the old login for backward compatibility
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Delete profile image from cloudinary if it exists
  if (user.profileImage?.public_id) {
    await cloudinary.uploader.destroy(user.profileImage.public_id);
  }

  // Delete the user
  await User.findByIdAndDelete(req.user._id);

  // Clear the token cookie
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User deleted successfully.",
    });
});

// Admin Routes
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!role) {
    return next(new ErrorHandler("Role is required.", 400));
  }

  const validRoles = ["user", "admin", "auctioneer"];
  if (!validRoles.includes(role.toLowerCase())) {
    return next(new ErrorHandler("Invalid role specified.", 400));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).select("-password -otp");

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: `User role updated to ${role} successfully.`,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    userName: req.body.userName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  };

  // Handle profile image upload if exists
  if (req.files && req.files.profileImage) {
    const profileImage = req.files.profileImage;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    
    if (!allowedFormats.includes(profileImage.mimetype)) {
      return next(new ErrorHandler("Invalid file format. Only PNG, JPEG, and WebP are allowed.", 400));
    }

    // Delete old image if exists
    if (req.user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(req.user.profileImage.public_id);
    }

    // Upload new image
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATFORM_USERS",
      }
    );

    newUserData.profileImage = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Update payment methods if provided
  if (req.body.bankAccountNumber || req.body.bankAccountName || req.body.bankName) {
    newUserData.paymentMethods = {
      bankTransfer: {
        bankAccountNumber: req.body.bankAccountNumber || req.user.paymentMethods?.bankTransfer?.bankAccountNumber,
        bankAccountName: req.body.bankAccountName || req.user.paymentMethods?.bankTransfer?.bankAccountName,
        bankName: req.body.bankName || req.user.paymentMethods?.bankTransfer?.bankName,
      },
      razorpay: {
        razorpayAccountId: req.body.razorpayAccountId || req.user.paymentMethods?.razorpay?.razorpayAccountId,
      },
      paypal: {
        paypalEmail: req.body.paypalEmail || req.user.paymentMethods?.paypal?.paypalEmail,
      },
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }).select('-password -otp');

  res.status(200).json({
    success: true,
    user,
  });
});

export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password -otp');
  
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({}).select('-password -otp');
  res.status(200).json({
    success: true,
    users,
  });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});
