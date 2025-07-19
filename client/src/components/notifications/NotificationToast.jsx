import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

const NotificationToast = ({
  notification,
  onClose,
  duration = 5000,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto close after duration
    const closeTimer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300); // Match animation duration
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getToastIcon = () => {
    switch (notification.type) {
      case "paper_approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "paper_declined":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "abstract_reset":
      case "fullpaper_reset":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "review_comment":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getToastColor = () => {
    switch (notification.type) {
      case "paper_approved":
        return "border-l-green-500 bg-green-50";
      case "paper_declined":
        return "border-l-red-500 bg-red-50";
      case "abstract_reset":
      case "fullpaper_reset":
        return "border-l-orange-500 bg-orange-50";
      case "review_comment":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  if (!notification) return null;

  return (
    <div
      className={`
                fixed z-50 w-96 max-w-md
                ${getPositionClasses()}
                transform transition-all duration-300 ease-in-out
                ${
                  isVisible && !isClosing
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }
            `}
    >
      <div
        className={`
                bg-white rounded-lg shadow-lg border-l-4 border border-gray-200
                ${getToastColor()}
                p-4 relative overflow-hidden
            `}
      >
        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all ease-linear"
          style={{
            width: isClosing ? "0%" : "100%",
            transitionDuration: isClosing ? "300ms" : `${duration}ms`,
          }}
        />

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getToastIcon()}</div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-700 break-words">
              {notification.message}
            </p>

            {notification.actionUrl && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    window.location.href = notification.actionUrl;
                    handleClose();
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View Details →
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts = [], onRemove, position = "top-right" }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id || index}
          style={{
            zIndex: 9999 - index, // Stack toasts properly
          }}
        >
          <NotificationToast
            notification={toast}
            onClose={() => onRemove(index)}
            position={position}
            duration={toast.duration || 5000}
          />
        </div>
      ))}
    </>
  );
};

export default NotificationToast;
export { ToastContainer };
