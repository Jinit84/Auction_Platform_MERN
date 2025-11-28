import { login, requestOTP, verifyOTP } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from '@/lib/axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null);

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      const response = await axios.post('/user/login/request-otp', { email, password });
      if (response.data.success) {
        setShowOtpInput(true);
        setUserId(response.data.userId);
        toast.success("OTP sent to your email!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      const response = await axios.post('/user/login/verify-otp', { email, otp, userId });
      if (response.data.success) {
        dispatch({ type: 'user/loginSuccess', payload: response.data });
        toast.success('Login successful!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {!showOtpInput ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[var(--foreground)]">Welcome Back!</h1>
                <p className="text-lg text-[var(--muted-foreground)] mt-2">Log in to continue to BidBazar.</p>
              </div>
              <form onSubmit={handleOtpRequest} className="space-y-6">
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                <button type="submit" disabled={loading} className="w-full bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50">
                  {loading ? "Sending OTP..." : "Continue with OTP"}
                </button>
                <p className="text-center text-sm text-[var(--muted-foreground)]">
                  Don't have an account? <Link to="/sign-up" className="font-semibold text-[var(--brand)] hover:underline">Sign up</Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[var(--foreground)]">Check Your Email</h1>
                <p className="text-lg text-[var(--muted-foreground)] mt-2">We've sent a 6-digit code to {email}.</p>
              </div>
              <form onSubmit={handleOtpVerification} className="space-y-6">
                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)] text-center text-2xl tracking-widest font-mono" />
                <button type="submit" disabled={loading} className="w-full bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50">
                  {loading ? "Verifying..." : "Log In"}
                </button>
                <button type="button" onClick={() => setShowOtpInput(false)} className="w-full text-center text-sm font-semibold text-[var(--brand)] hover:underline">
                  Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;