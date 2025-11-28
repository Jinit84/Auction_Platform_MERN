import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import Spinner from "@/custom-components/Spinner";
import { IoTimerOutline } from "react-icons/io5";
import { FaGavel, FaCheckCircle, FaExclamationCircle, FaPlayCircle, FaCreditCard } from "react-icons/fa";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

// Helper to load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Countdown Timer Component
const Countdown = ({ date, onEnd }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(date) - new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else if (onEnd) {
      onEnd();
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [date]);

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    if (value === 0 && interval !== 'seconds' && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
      if(interval === 'days' || interval === 'hours') return null;
    }
    return (
      <span key={interval} className="text-center">
        <span className="text-2xl font-bold">{String(value).padStart(2, '0')}</span>
        <span className="block text-xs">{interval.toUpperCase()}</span>
      </span>
    );
  });

  return (
    <div className="flex justify-center gap-4 font-mono text-[var(--brand)]">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

const AuctionItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading, auctionDetail, auctionBidders } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [amount, setAmount] = useState("");
  const [now, setNow] = useState(new Date());

  // Effect 1: Handles authentication check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, loading, navigateTo]);

  // Effect 2: Fetches auction data when the component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [id, dispatch]);
  
  // Effect 3: Runs a timer to keep the 'now' state updated
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleBid = () => {
    dispatch(placeBid(id, { amount }));
    setAmount("");
  };

  // Payment Handler
  const handlePayment = async () => {
      const res = await loadRazorpayScript();
      if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
      }

      try {
          // 1. Create Order
          const { data: { order } } = await axios.post("/payment/create-order", {
              amount: auctionDetail.currentBid
          });

          // 2. Options for Razorpay Checkout
          const options = {
              key: "YOUR_RAZORPAY_KEY_ID_HERE", // ENTER YOUR KEY_ID HERE
              amount: order.amount,
              currency: order.currency,
              name: "BidBazar Auction",
              description: `Payment for ${auctionDetail.title}`,
              order_id: order.id,
              handler: async function (response) {
                  // 3. Verify Payment on Success
                  try {
                      const verifyRes = await axios.post("/payment/verify-payment", {
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          auctionId: id
                      });
                      if (verifyRes.data.success) {
                          toast.success("Payment Successful!");
                          dispatch(getAuctionDetail(id)); // Refresh data to show "Paid" status
                      }
                  } catch (error) {
                      toast.error("Payment verification failed!");
                  }
              },
              prefill: {
                  name: user.userName,
                  email: user.email,
                  contact: user.phone
              },
              theme: {
                  color: "#1B3C53"
              }
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();

      } catch (error) {
          toast.error("Error initiating payment.");
          console.error(error);
      }
  };
  
  const auctionStatus = useMemo(() => {
    if (!auctionDetail || !auctionDetail.startTime) return "loading";
    const startTime = new Date(auctionDetail.startTime);
    const endTime = new Date(auctionDetail.endTime);
    if (now < startTime) return "upcoming";
    if (now > endTime) return "ended";
    return "active";
  }, [auctionDetail, now]);

  const winner = useMemo(() => {
    if (auctionStatus !== "ended" || !auctionBidders || auctionBidders.length === 0) return null;
    return auctionBidders[0];
  }, [auctionStatus, auctionBidders]);

  // Check if current user is the winner
  const isWinner = winner && user && winner.userId === user._id;

  const currentBid = auctionDetail?.currentBid > 0 ? auctionDetail.currentBid : auctionDetail?.startingBid;

  if (loading || auctionStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <section className="w-full ml-0 m-0 px-5 pt-20 lg:pl-[320px] min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img src={auctionDetail.image?.url} alt={auctionDetail.title} className="w-full h-96 object-cover" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">{auctionDetail.title}</h1>
            <div className="flex items-center gap-4 text-[var(--muted-foreground)] mb-4">
              <span>Category: <span className="font-semibold text-[var(--foreground)]">{auctionDetail.category}</span></span>
              <span>Condition: <span className="font-semibold text-[var(--foreground)]">{auctionDetail.condition}</span></span>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed">{auctionDetail.description}</p>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            {/* UI for different auction statuses */}
            {auctionStatus === "upcoming" && (
              <div className="text-center m-auto">
                <FaPlayCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Auction Starts In</h3>
                <Countdown date={auctionDetail.startTime} onEnd={() => setNow(new Date())} />
              </div>
            )}
            {auctionStatus === "ended" && (
                <div className="text-center m-auto w-full">
                    <FaExclamationCircle size={48} className="mx-auto text-red-400 mb-4" />
                    <h3 className="text-2xl font-semibold text-red-500 mb-2">Auction Has Ended</h3>
                    {winner ? (
                    <div className="w-full">
                        <p className="text-lg text-[var(--muted-foreground)] mb-4">
                            Won by <span className="font-bold text-[var(--foreground)]">{winner.userName}</span> with a bid of <span className="font-bold text-[var(--foreground)]">₹{winner.amount.toLocaleString()}</span>
                        </p>
                        
                        {/* Winner Payment Section */}
                        {isWinner && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4 w-full">
                                <h4 className="text-xl font-bold text-green-800 mb-2">Congratulations! You Won!</h4>
                                {auctionDetail.isPaid ? (
                                    <div className="flex flex-col items-center gap-2 text-green-700">
                                        <FaCheckCircle size={32} />
                                        <span className="font-semibold text-lg">Payment Complete</span>
                                        <p className="text-sm">Thank you for your payment.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-green-700">Please complete the payment to claim your item.</p>
                                        <button 
                                            onClick={handlePayment}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                                        >
                                            <FaCreditCard /> Pay ₹{winner.amount.toLocaleString()} Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    ) : (
                    <p className="text-lg text-[var(--muted-foreground)]">This auction ended without any bids.</p>
                    )}
                </div>
            )}
            {auctionStatus === "active" && (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-[var(--muted-foreground)]">Time Remaining</p>
                    <Countdown date={auctionDetail.endTime} onEnd={() => setNow(new Date())} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Current Bid</p>
                      <p className="text-3xl font-bold text-[var(--foreground)]">₹{currentBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Bids</p>
                      <p className="text-3xl font-bold text-[var(--foreground)]">{auctionBidders.length}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-center text-sm text-[var(--muted-foreground)] mb-2">Enter bid amount (higher than ₹{currentBid.toLocaleString()})</p>
                  <div className="flex gap-2">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`₹${currentBid + 1}`} className="w-full p-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" min={currentBid + 1} />
                    <button onClick={handleBid} disabled={!amount || amount <= currentBid || (user && user._id === auctionDetail.createdBy)} className="bg-[var(--brand)] text-white font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <FaGavel /> Place Bid
                    </button>
                  </div>
                  {user && user._id === auctionDetail.createdBy && <p className="text-red-500 text-xs text-center mt-2">You cannot bid on your own auction.</p>}
                </div>
                <div className="flex-grow overflow-y-auto">
                  <h3 className="font-semibold text-lg mb-2 text-[var(--foreground)]">Bid History</h3>
                  <div className="space-y-3">
                    {auctionBidders && auctionBidders.length > 0 ? (
                      auctionBidders.map((bid, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-md ${index === 0 ? 'bg-green-100 border border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <img src={bid.profileImage} alt={bid.userName} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold">{bid.userName}</span>
                          </div>
                          <span className={`font-bold ${index === 0 ? 'text-green-600' : 'text-[var(--foreground)]'}`}>₹{bid.amount.toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[var(--muted-foreground)] py-4">No bids yet. Be the first!</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionItem;