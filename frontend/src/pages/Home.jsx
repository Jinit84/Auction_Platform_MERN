import React from "react";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import { FaGavel, FaSearch, FaTrophy, FaRegCreditCard } from "react-icons/fa";

const howItWorksSteps = [
  { icon: <FaSearch size={24} />, title: "Find Your Item", description: "Browse through categories and discover unique items." },
  { icon: <FaGavel size={24} />, title: "Place Your Bid", description: "Enter your bid amount and stay ahead of the competition." },
  { icon: <FaTrophy size={24} />, title: "Win the Auction", description: "The highest bidder wins when the timer runs out." },
  { icon: <FaRegCreditCard size={24} />, title: "Pay & Receive", description: "Complete the payment and get your new item delivered." },
];

const Home = () => {
  return (
    <main className="w-full lg:ml-64">
      <section className="relative h-[70vh] flex items-center justify-center">
        {/* Animated lively background */}
        <div className="absolute inset-0 h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--accent)] to-[var(--brand-light)] opacity-80 animate-pulse"></div>
          {/* Floating circles for 'live' effect */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--brand-light)] opacity-30 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-2/3 left-2/3 w-24 h-24 bg-[var(--accent)] opacity-20 rounded-full animate-bounce-slower"></div>
          <div className="absolute bottom-10 right-1/3 w-16 h-16 bg-[var(--brand)] opacity-20 rounded-full animate-bounce"></div>
        </div>
        {/* Overlay for contrast */}
        <div className="absolute inset-0 h-[70vh] bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-center p-5">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white">Discover, Bid, and Win</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white">The premier online marketplace for unique finds and exclusive collections. Your next treasure awaits.</p>
          <Link to="/auctions" className="bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-[var(--brand-dark)] transition-all duration-300 shadow-lg">
            Browse Live Auctions
          </Link>
        </div>
      </section>

  <div className="p-8">
        <section className="my-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-[var(--foreground)]">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="bg-[var(--card)] p-6 rounded-lg text-center flex flex-col items-center shadow-md">
                <div className="bg-[var(--accent)] text-white rounded-full p-4 mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2 text-[var(--card-foreground)]">{step.title}</h3>
                <p className="text-[var(--muted-foreground)]">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </div>
    </main>
  );
};

export default Home;
// Add custom animations for lively effect
// Add to global CSS or Tailwind config if not present
/*
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
@keyframes bounce-slower {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
.animate-bounce-slower {
  animation: bounce-slower 5s infinite;
}
*/