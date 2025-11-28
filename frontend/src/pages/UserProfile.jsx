import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";

// A small component for displaying a piece of profile data
const DetailItem = ({ label, value }) => {
  if (!value) return null; // Don't render if there's no value
  return (
    <div>
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className="text-lg font-medium text-[var(--foreground)]">{value}</p>
    </div>
  );
};

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigateTo("/login");
    }
  }, [isAuthenticated, loading, navigateTo]);

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <section className="w-full ml-0 m-0 px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto w-full my-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Profile Header */}
          <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left gap-6 pb-6 border-b">
            <img
              src={user.profileImage?.url || "/imageHolder.jpg"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
            />
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">{user.userName}</h1>
              <p className="text-lg text-[var(--muted-foreground)] mt-1">{user.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Joined on: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 bg-[var(--brand)] text-white text-sm font-semibold rounded-full">
              {user.role}
            </span>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center py-6 border-b">
            {user.role === "Bidder" ? (
              <>
                <DetailItem label="Auctions Won" value={user.auctionsWon} />
                <DetailItem label="Money Spent" value={`$${user.moneySpent.toLocaleString()}`} />
              </>
            ) : user.role === "Auctioneer" ? (
               <DetailItem label="Unpaid Commission" value={`$${user.unpaidCommission.toLocaleString()}`} />
            ) : null}
          </div>

          {/* Personal Details */}
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Phone Number" value={user.phone} />
              <DetailItem label="Address" value={user.address} />
            </div>
          </div>
          
          {/* Payment Details for Auctioneer */}
          {user.role === "Auctioneer" && user.paymentMethods && (
            <div className="pt-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem label="Bank Name" value={user.paymentMethods.bankTransfer?.bankName} />
                <DetailItem label="Account Holder" value={user.paymentMethods.bankTransfer?.bankAccountName} />
                <DetailItem label="Account Number" value={user.paymentMethods.bankTransfer?.bankAccountNumber} />
                <DetailItem label="Razorpay ID" value={user.paymentMethods.razorpay?.razorpayAccountId} />
                <DetailItem label="PayPal Email" value={user.paymentMethods.paypal?.paypalEmail} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;