import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
   const [userName, setUserName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [address, setAddress] = useState("");
   const [role, setRole] = useState("");
   const [password, setPassword] = useState("");
   const [bankAccountName, setBankAccountName] = useState("");
   const [bankAccountNumber, setBankAccountNumber] = useState("");
   const [bankName, setBankName] = useState("");
   const [razorpayAccountId, setRazorpayAccountId] = useState("");
   const [paypalEmail, setPaypalEmail] = useState("");
   const [profileImage, setProfileImage] = useState("");
   const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    if (role === "Auctioneer") {
      formData.append("bankAccountName", bankAccountName);
      formData.append("bankAccountNumber", bankAccountNumber);
      formData.append("bankName", bankName);
      formData.append("razorpayAccountId", razorpayAccountId);
      formData.append("paypalEmail", paypalEmail);
    }
    dispatch(register(formData));
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--foreground)]">Create Your Account</h1>
            <p className="text-lg text-[var(--muted-foreground)] mt-2">
              Join BidBazar today to start bidding and selling.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={profileImagePreview ? profileImagePreview : "/imageHolder.jpg"}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <input type="file" onChange={imageHandler} required className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand)] file:text-white hover:file:opacity-90"/>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              <input type="text" placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                <option value="">Select Role</option>
                <option value="Bidder">Bidder (I want to buy)</option>
                <option value="Auctioneer">Auctioneer (I want to sell)</option>
              </select>
            </div>

            {/* Payment Details for Auctioneer */}
            {role === "Auctioneer" && (
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Payment Details</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">This information will be shared with winning bidders to receive payments.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" required>
                    <option value="">Select Your Bank</option>
                    <option value="HDFC">HDFC</option>
                    <option value="SBI">SBI</option>
                    <option value="ICICI">ICICI</option>
                    <option value="BOB">BOB</option>
                  </select>
                  <input type="text" placeholder="Bank Account Number" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  <input type="text" placeholder="Bank Account Holder's Name" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} required className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  <input type="text" placeholder="Razorpay Account ID " value={razorpayAccountId} onChange={(e) => setRazorpayAccountId(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  <input type="email" placeholder="PayPal Email " value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
              </div>
            )}
            
            <button type="submit" disabled={loading} className="w-full bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50">
              {loading ? "Registering..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-[var(--muted-foreground)]">
              Already have an account? <Link to="/login" className="font-semibold text-[var(--brand)] hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;