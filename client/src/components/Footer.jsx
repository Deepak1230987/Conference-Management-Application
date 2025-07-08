import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Conference Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-100">ICTACEM 2025</h3>
            <p className="text-green-200 text-sm leading-relaxed">
              Department of Aerospace Engineering Indian Institute of Technology
              Kharagpur P.O. Kharagpur, Pin - 721302 Dist. Paschim Medinipur,
              West Bengal, India Phone: 03222-282241 Email:
              ictacem@aero.iitkgp.ac.in
            </p>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-200 text-sm">
                Conference Venue Location
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-100">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  About Conference
                </Link>
              </li>
              <li>
                <Link
                  to="/committee"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  Committee
                </Link>
              </li>
              <li>
                <Link
                  to="/speakers"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  Keynote Speakers
                </Link>
              </li>
              <li>
                <Link
                  to="/schedule"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-100">
              Contact us
            </h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-green-200 text-sm">
                    <div className="font-semibold">
                      Department of Aerospace Engineering
                    </div>
                    <div>Indian Institute of Technology Kharagpur</div>
                    <div>P.O. Kharagpur, Pin - 721302</div>
                    <div>Dist. Paschim Medinipur, West Bengal, India</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="tel:03222-282241"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  03222-282241
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:ictacem@aero.iitkgp.ac.in"
                  className="text-green-200 hover:text-white transition-colors duration-200 text-sm"
                >
                  ictacem@aero.iitkgp.ac.in
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-green-200 text-sm">
              &copy; {new Date().getFullYear()} ICTACEM{" "}
              {new Date().getFullYear()}. All rights reserved.
            </p>
            <p className="text-green-300 text-xs mt-1">
             International Conference on Theoretical Applied Computational and Experimental Mechanics
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
