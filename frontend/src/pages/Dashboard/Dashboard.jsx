import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";
import Spinner from "@/custom-components/Spinner";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import { FaDollarSign, FaUsers, FaGavel, FaFileInvoice } from "react-icons/fa";

// Component for the Key Metric Cards
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading, monthlyRevenue, totalAuctioneers, totalBidders, paymentProofs } = useSelector((state) => state.superAdmin);
  const { allAuctions } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.role !== "Super Admin") {
      navigateTo("/");
    }
  }, [isAuthenticated, user, navigateTo]);
  
  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(getAllAuctionItems());
    dispatch(clearAllSuperAdminSliceErrors());
  }, [dispatch]);
  
  const stats = useMemo(() => {
    const totalRevenue = monthlyRevenue.reduce((acc, month) => acc + month, 0);
    const totalUsers = totalBidders.reduce((acc, count) => acc + count, 0) + totalAuctioneers.reduce((acc, count) => acc + count, 0);
    const pendingProofs = paymentProofs.filter(p => p.status === "Pending").length;
    
    return { totalRevenue, totalUsers, pendingProofs };
  }, [monthlyRevenue, totalBidders, totalAuctioneers, paymentProofs]);


  return (
    <article className="w-full ml-0 m-0 px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen">
       {loading ? (
        <Spinner />
      ) : (
        <div className="my-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-[var(--foreground)]">Admin Dashboard</h1>

            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard icon={<FaDollarSign size={22} className="text-white" />} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="bg-green-500" />
              <StatCard icon={<FaUsers size={22} className="text-white" />} label="Total Users" value={stats.totalUsers.toLocaleString()} color="bg-blue-500" />
              <StatCard icon={<FaGavel size={22} className="text-white" />} label="Total Auctions" value={allAuctions.length.toLocaleString()} color="bg-purple-500" />
              <StatCard icon={<FaFileInvoice size={22} className="text-white" />} label="Pending Proofs" value={stats.pendingProofs} color="bg-orange-500" />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Monthly Revenue</h3>
                    <PaymentGraph />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">New User Registrations</h3>
                    <BiddersAuctioneersGraph />
                </div>
                <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Commission Payment Proofs</h3>
                    <PaymentProofs />
                </div>
                 <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Manage Auctions</h3>
                    <AuctionItemDelete />
                </div>
            </div>
        </div>
      )}
    </article>
  );
};

export default Dashboard;