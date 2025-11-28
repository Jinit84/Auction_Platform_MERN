import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAuction, republishAuction } from "@/store/slices/auctionSlice";
import { IoTimerOutline } from "react-icons/io5";

const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    if (days > 0) {
      return `${days}d ${pad(hours)}h ${pad(minutes)}m`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleDeleteAuction = () => {
    // Optional: Add a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete the auction "${title}"?`)) {
      dispatch(deleteAuction(id));
    }
  };
  
  const isEnded = Object.keys(timeLeft).length === 0;

  return (
    <>
      <div className="group flex-grow basis-full sm:basis-44 lg:basis-52 2xl:basis-64 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col overflow-hidden" style={{ maxWidth: '260px', minWidth: '180px' }}>
        <div className="relative w-full h-36 overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            src={imgSrc}
            alt={title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            style={{ aspectRatio: '4/3' }}
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-base text-[var(--foreground)] mb-1 truncate">
            {title}
          </h3>
          <div className="mt-auto">
            <div className="mb-2">
              <p className="text-xs text-[var(--muted-foreground)]">Starting Bid</p>
              <p className="text-lg font-bold text-[var(--foreground)]">
                Rs.{startingBid.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                <IoTimerOutline /> {timeLeft.type || "Auction"}
              </p>
              {Object.keys(timeLeft).length > 1 ? (
                <p className="text-base font-bold text-[var(--brand)] font-mono">
                  {formatTimeLeft(timeLeft)}
                </p>
              ) : (
                <p className="text-base font-bold text-red-500">Ended</p>
              )}
            </div>
          </div>
          <div className="border-t pt-3 mt-3 flex flex-col gap-2">
             <button
              onClick={() => setOpenDrawer(true)}
              disabled={!isEnded}
              className="w-full text-center font-semibold bg-[var(--brand)] text-white px-3 py-1.5 rounded-md transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Republish Auction
            </button>
            <Link
              className="w-full text-center font-semibold border border-[var(--brand)] text-[var(--brand)] px-3 py-1.5 rounded-md transition-all duration-300 hover:bg-[var(--brand)] hover:text-white text-sm"
              to={`/auction/details/${id}`}
            >
              View Auction
            </Link>
            <button
              onClick={handleDeleteAuction}
              className="w-full text-center text-xs text-red-500 hover:bg-red-50 rounded-md py-1.5 transition-all duration-300"
            >
              Delete Auction
            </button>
          </div>
        </div>
      </div>
      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
};

const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { loading } = useSelector((state) => state.auction);

  const handleRepublishAuction = () => {
    const formData = new FormData();
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(republishAuction(id, formData));
    // Optionally close drawer on success
  };

  return (
    <section
      className={`fixed inset-0 bg-black bg-opacity-60 flex items-end z-50 transition-opacity duration-300 ${
        openDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setOpenDrawer(false)}
    >
      <div
        className={`bg-white w-full max-w-lg mx-auto rounded-t-xl transition-transform duration-300 ${
          openDrawer ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-center mb-2 text-[var(--foreground)]">
            Republish Auction
          </h3>
          <p className="text-center text-[var(--muted-foreground)] mb-6">
            Set a new start and end time for this item.
          </p>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[var(--muted-foreground)]">
                New Start Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h:mm aa"}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[var(--muted-foreground)]">
                New End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h:mm aa"}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <button
                type="button"
                className="w-full bg-[var(--brand)] text-white font-semibold py-3 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
                onClick={handleRepublishAuction}
                disabled={loading}
              >
                {loading ? "Republishing..." : "Confirm and Republish"}
              </button>
              <button
                type="button"
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-md transition-colors hover:bg-gray-300"
                onClick={() => setOpenDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CardTwo;