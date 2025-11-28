import React, { useState } from "react";
import { RiAuctionFill, RiFileList2Line } from "react-icons/ri";
import { MdLeaderboard, MdDashboard, MdOutlineInfo, MdWorkHistory } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCreate, IoIosPerson, IoIosLogOut } from "react-icons/io";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { VscChromeClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { NavLink, Link } from "react-router-dom";

// This component renders the navigation links
const NavLinks = ({ onLinkClick }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    if (onLinkClick) onLinkClick();
  };

  const NavItem = ({ to, icon, children }) => (
    <li>
      <NavLink
        to={to}
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
            isActive
              ? "bg-[var(--primary)] text-white" // Active: Dark Blue BG, White Text
              : "text-[var(--sidebar-foreground)] hover:bg-[var(--primary)] hover:text-white" // Default: Dark Blue Text. Hover: Dark Blue BG, White Text
          }`
        }
      >
        {icon}
        <span>{children}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-grow">
        <ul className="space-y-1">
          <NavItem to="/auctions" icon={<RiAuctionFill />}>Auctions</NavItem>
          <NavItem to="/leaderboard" icon={<MdLeaderboard />}>Leaderboard</NavItem>
          {isAuthenticated && user?.role === "Auctioneer" && (
            <>
              <hr className="my-3 border-gray-200" />
              <NavItem to="/create-auction" icon={<IoIosCreate />}>Create Auction</NavItem>
              <NavItem to="/view-my-auctions" icon={<RiFileList2Line />}>My Auctions</NavItem>
              <NavItem to="/submit-commission" icon={<FaFileInvoiceDollar />}>Submit Commission</NavItem>
            </>
          )}
          {isAuthenticated && user?.role === "Super Admin" && (
            <>
              <hr className="my-3 border-gray-200" />
              <NavItem to="/dashboard" icon={<MdDashboard />}>Dashboard</NavItem>
            </>
          )}
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <hr className="my-3 border-gray-200" />
          {isAuthenticated && <NavItem to="/me" icon={<IoIosPerson />}>Profile</NavItem>}
          <NavItem to="/how-it-works-info" icon={<MdWorkHistory />}>How It Works</NavItem>
          <NavItem to="/about" icon={<MdOutlineInfo />}>About Us</NavItem>
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-red-500 hover:bg-red-100 transition-colors duration-200"
              >
                <IoIosLogOut />
                <span>Logout</span>
              </button>
            </li>
          ) : (
            <>
              <NavItem to="/login" icon={<IoIosPerson />}>Login</NavItem>
              <NavItem to="/sign-up" icon={<IoIosPerson />}>Sign Up</NavItem>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* HAMBURGER MENU - Only on screens smaller than 'lg' */}
      <header className="lg:hidden fixed top-0 right-0 p-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="text-[var(--sidebar-foreground)] bg-white/80 backdrop-blur-sm p-2 rounded-md shadow-md"
        >
          <GiHamburgerMenu size={24} />
        </button>
      </header>
      
      {/* DESKTOP SIDEBAR - Only on 'lg' screens and up */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-[var(--sidebar-bg)] p-4 border-r border-[var(--border)] overflow-y-auto">
        <Link to="/" className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-6">
          Bid<span className="text-[var(--accent)]">Bazar</span>
        </Link>
        <NavLinks />
      </aside>

      {/* MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60"
          ></div>
          {/* Menu */}
          <div className="relative w-64 h-full bg-[var(--sidebar-bg)] p-4 shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <VscChromeClose size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold text-[var(--sidebar-foreground)] mb-6 block">
              Bid<span className="text-[var(--accent)]">Bazar</span>
            </Link>
            <NavLinks onLinkClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;