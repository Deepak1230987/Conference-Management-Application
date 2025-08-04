import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./notifications/NotificationDropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use the auth context instead of local state
  const { user, loading, logout: authLogout } = useAuth();

  // Check for admin role in both possible locations
  const isAdmin = user?.role === "admin" || user?.user?.role === "admin";

  // All navigation links in a single array
  const navLinks = [
    { name: "Home", path: "/", icon: "ri-home-4-line" },
    { name: "Brochure", path: "/brochure", icon: "ri-book-open-line" },
    {
      name: "Extended Abstract Format",
      path: "/extended-abstract-format",
      icon: "ri-file-text-line",
    },
    { name: "Speakers", path: "/speakers", icon: "ri-user-3-line" },
    {
      name: "Important Dates",
      path: "/important-dates",
      icon: "ri-calendar-2-line",
    },
    { name: "Schedule", path: "/schedule", icon: "ri-calendar-check-line" },
    { name: "Committee", path: "/committee", icon: "ri-team-line" },
    { name: "Sponsorship", path: "/sponsorship", icon: "ri-hand-heart-line" },
    { name: "Papers Presented", path: "/papers", icon: "ri-file-list-3-line" },
  ];

  // Handle logout using auth context
  const handleLogout = async () => {
    try {
      const result = await authLogout();
      if (result.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Main navbar */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-sky-900 bg-opacity-95 shadow-lg" : "bg-sky-950"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center cursor-pointer text-white px-4 py-4"
            >
              {/* <span className="text-blue-400 text-2xl">
                <i className="ri-rocket-2-fill"></i>
              </span> */}
              <span className="font-bold text-xl tracking-tight ml-2">
                ICTACEM<span className="text-blue-400">2025</span>
              </span>
            </div>

            {/* Desktop Navigation - Simple row */}
            <div className="hidden lg:flex mr-10">
              <ul className="flex items-center space-x-6">
                {navLinks.map((link, index) => (
                  <li
                    key={index}
                    onClick={() => navigate(link.path)}
                    className="relative cursor-pointer group"
                  >
                    <div
                      className={`flex items-center font-medium text-md ${
                        isActive(link.path)
                          ? "text-blue-300"
                          : "text-white hover:text-blue-200"
                      }`}
                    >
                      <span>{link.name}</span>
                    </div>

                    {/* Animated underline */}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-300 transition-all duration-300 ${
                        isActive(link.path)
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden px-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md focus:outline-none text-white"
              >
                {mobileMenuOpen ? (
                  <i className="ri-close-line text-2xl"></i>
                ) : (
                  <i className="ri-menu-line text-2xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Action Navbar with animations and hover effects */}
      <div className="fixed w-full top-14 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center py-2 space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-700 font-medium bg-amber-200 px-2 py-1 rounded-md text-sm">
                      See your profile page to get your ICTACEM-2025 ID
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">
                        Welcome,{" "}
                        <span className="font-medium">
                          {user.username || user.user?.username}
                        </span>
                      </span>

                      {/* Notification Dropdown */}
                      <NotificationDropdown />

                    

                      <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-600 hover:text-blue-500 flex items-center font-medium mx-3 transition-all duration-300 hover:scale-105 relative group"
                      >
                        <i className="ri-user-settings-line mr-1 group-hover:animate-pulse"></i>{" "}
                        Profile
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                      </button>

                      {/* Admin link - check both possible locations for the role */}
                      {isAdmin && (
                        <button
                          onClick={() => navigate("/admin")}
                          className="text-white bg-red-600 hover:bg-red-700 flex items-center font-medium mx-3 px-3 py-1 rounded transition-all duration-300 hover:scale-105"
                        >
                          <i className="ri-admin-line mr-1"></i> Admin
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-blue-500 flex items-center font-medium transition-all duration-300 hover:scale-105 relative group"
                      >
                        <i className="ri-logout-box-line mr-1 group-hover:animate-pulse"></i>{" "}
                        Logout
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button
                      onClick={() => navigate("/submit")}
                      className="bg-blue-500  text-white py-1 px-4 rounded  font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        Submit Extended Abstract/Paper
                      </span>
                      <span className="absolute top-0 left-0 w-full h-0 bg-blue-600 transition-all duration-300 group-hover:h-full"></span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 bg-sky-600 text-white px-2 py-1 rounded-md font-medium">
                      Sign Up/Login to submit your Extended Abstract/Paper
                    </div>
                    <button
                      onClick={() => navigate("/registration")}
                      className="flex items-center text-gray-700 hover:text-blue-500  font-medium transition-all duration-300 hover:scale-105 relative group"
                    >
                      <i className="ri-user-add-line mr-1 "></i> Sign up
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center text-gray-700 hover:text-blue-500  font-medium transition-all duration-300 hover:scale-105 relative group"
                    >
                      <i className="ri-login-box-line mr-1 "></i> Login
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden fixed top-[64px] w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-30 ${
          mobileMenuOpen
            ? "max-h-[80vh] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${link.icon} text-lg`}></i>
                  <span className="font-medium">{link.name}</span>
                </div>
              </li>
            ))}

            {/* Authentication Links for Mobile */}
            {!loading && (
              <>
                {user ? (
                  <>
                    <li className="p-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className="ri-user-line text-blue-600"></i>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </div>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <i className="ri-user-settings-line text-lg"></i>
                        <span className="font-medium">Profile</span>
                      </div>
                    </li>
                    {/* Admin link for mobile - check both possible locations for the role */}
                    {isAdmin && (
                      <li
                        onClick={() => {
                          navigate("/admin");
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <div className="flex items-center space-x-2">
                          <i className="ri-admin-line text-lg"></i>
                          <span className="font-medium">Admin Dashboard</span>
                        </div>
                      </li>
                    )}
                    <li
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <i className="ri-logout-box-line text-lg"></i>
                        <span className="font-medium">Logout</span>
                      </div>
                    </li>
                    {/* Submit Paper button only shown when logged in */}
                    <li className="pt-2 border-t border-gray-100 mt-3">
                      <button
                        onClick={() => {
                          navigate("/submit");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-all duration-300"
                      >
                        SUBMIT EXTENDED ABSTRACT/PAPER
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      onClick={() => {
                        navigate("/registration");
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-50 border-t border-gray-100 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <i className="ri-user-add-line text-lg"></i>
                        <span className="font-medium">Sign Up</span>
                      </div>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <i className="ri-login-box-line text-lg"></i>
                        <span className="font-medium">Login</span>
                      </div>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Add padding to content below both navbars */}
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;
