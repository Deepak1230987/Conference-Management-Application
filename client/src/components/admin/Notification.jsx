import React, { useState, useEffect } from "react";

/**
 * Notification component for displaying success or error messages
 * @param {Object} props - Component props
 * @param {Object|String} props.error - Error object or message string
 */
const Notification = ({ error }) => {
  const [visible, setVisible] = useState(false);
  const [currentError, setCurrentError] = useState(null);

  // Handle new errors and trigger animation
  useEffect(() => {
    if (error) {
      setCurrentError(error);
      setVisible(true);

      // Auto-hide success messages after 5 seconds
      if (error.type === "success") {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [error]);

  // Handle closing animation
  const handleClose = () => {
    setVisible(false);
  };

  if (!currentError) return null;

  const isSuccess = currentError.type === "success";

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-md shadow-lg transition-all duration-300 ease-in-out transform 
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${
          isSuccess
            ? "bg-green-50 border-l-4 border-green-400 text-green-700"
            : "bg-red-50 border-l-4 border-red-400 text-red-700"
        }`}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {isSuccess ? (
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {isSuccess ? "Success" : "Error"}
          </h3>
          <p className="mt-1 text-sm">{currentError.message || currentError}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar for success messages */}
      {isSuccess && visible && (
        <div
          className="h-1 bg-green-500 animate-progress-bar origin-left"
          style={{ animationDuration: "5s" }}
        ></div>
      )}
    </div>
  );
};

export default Notification;
