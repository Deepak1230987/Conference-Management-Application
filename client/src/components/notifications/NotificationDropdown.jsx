import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  MessageSquare,
  FileText,
  RefreshCw,
} from "lucide-react";
import NotificationAPI from "../../utils/notificationAPI.js";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Format notification message to replace status values
  const formatNotificationMessage = (message) => {
    // Replace common status patterns in messages
    return message
      .replace(/review_awaited/g, "Review Awaited")
      .replace(/review_in_progress/g, "Review in Progress")
      .replace(/author_response_awaited/g, "Author Response Awaited")
      .replace(/abstract_accepted/g, "Abstract Accepted")
      .replace(/declined/g, "Declined")
      .replace(/submitted/g, "Submitted");
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationAPI.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  const fetchNotifications = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await NotificationAPI.getUserNotifications(pageNum, 10);

      const data = response.data || {};
      const notificationsData = data.notifications || [];
      const paginationData = data.pagination || { hasNext: false };

      if (reset) {
        setNotifications(notificationsData);
      } else {
        setNotifications((prev) => [...prev, ...notificationsData]);
      }

      setHasMore(paginationData.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownToggle = () => {
    if (!isOpen) {
      fetchNotifications(1, true);
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await NotificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await NotificationAPI.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "paper_status_change":
        return <FileText className="w-4 h-4" />;
      case "abstract_reset":
      case "fullpaper_reset":
        return <RefreshCw className="w-4 h-4" />;
      case "review_comment":
        return <MessageSquare className="w-4 h-4" />;
      case "paper_approved":
        return <Check className="w-4 h-4 text-green-500" />;
      case "paper_declined":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === "urgent") return "border-l-red-500";
    if (priority === "high") return "border-l-orange-500";
    if (type === "paper_approved") return "border-l-green-500";
    if (type === "paper_declined") return "border-l-red-500";
    return "border-l-blue-500";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notificationDate.toLocaleDateString();
  };

  return (
    <div className="relative  ml-4 mr-4" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <Bell className="w-6 h-6 text-[#38d5fc]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <div className="flex items-center gap-3 ">
                    {/* View All Notifications Link */}
                    <button
                      onClick={() => navigate("/notifications")}
                      className="text-gray-600 hover:text-blue-500 text-sm font-medium transition-all duration-300"
                      title="View all notifications"
                    >
                      View All
                    </button>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && !loading ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-l-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${getNotificationColor(
                      notification.type,
                      notification.priority
                    )} ${!notification.isRead ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 break-words">
                            {formatNotificationMessage(notification.message)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={(e) =>
                              handleMarkAsRead(notification._id, e)
                            }
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(notification._id, e)
                          }
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="p-4 text-center border-t border-gray-200">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      {loading ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
