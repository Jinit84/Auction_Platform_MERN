import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoTimerOutline } from "react-icons/io5";

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
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
    // Update the timer every second
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

  return (
    <Link
      to={`/auction/item/${id}`}
      className="group flex-grow basis-full sm:basis-56 lg:basis-60 2xl:basis-80 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2 truncate group-hover:text-[var(--brand)]">
          {title}
        </h3>
        <div className="mt-auto">
          <div className="mb-3">
            <p className="text-sm text-[var(--muted-foreground)]">Starting Bid</p>
            <p className="text-xl font-bold text-[var(--foreground)]">
              Rs{startingBid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
              <IoTimerOutline /> {timeLeft.type || "Auction"}
            </p>
            {Object.keys(timeLeft).length > 1 ? (
              <p className="text-lg font-bold text-[var(--brand)] font-mono">
                {formatTimeLeft(timeLeft)}
              </p>
            ) : (
              <p className="text-lg font-bold text-red-500">Ended</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;