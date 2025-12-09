import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  FileText,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import NotificationAPI from "../utils/notificationAPI.js";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const onlyUnread = filter === "unread";
      const response = await NotificationAPI.getUserNotifications(
        currentPage,
        20,
        onlyUnread
      );

      // Handle different response structures flexibly
      const responseData = response.data?.data || response.data || {};
      const notificationsArray = responseData.notifications || [];
      const paginationData = responseData.pagination || {};

      if (filter === "read") {
        // Filter for read notifications on client side since API doesn't have this option
        const allResponse = await NotificationAPI.getUserNotifications(
          currentPage,
          20,
          false
        );
        const allData = allResponse.data?.data || allResponse.data || {};
        const allNotifications = allData.notifications || [];
        const readNotifications = allNotifications.filter((n) => n.isRead);
        setNotifications(readNotifications);
        setPagination(allData.pagination || {});
      } else {
        setNotifications(notificationsArray);
        setPagination(paginationData);
      }

      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationAPI.getUnreadCount();
      setUnreadCount(response.data?.count || response.count || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      await fetchUnreadCount();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationAPI.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      await fetchUnreadCount();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "paper_status_change":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "abstract_reset":
      case "fullpaper_reset":
        return <RefreshCw className="w-5 h-5 text-orange-600" />;
      case "review_comment":
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case "paper_approved":
        return <Check className="w-5 h-5 text-green-600" />;
      case "paper_declined":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBadge = (type, priority) => {
    if (priority === "urgent") return "bg-red-100 text-red-800";
    if (priority === "high") return "bg-orange-100 text-orange-800";
    if (type === "paper_approved") return "bg-green-100 text-green-800";
    if (type === "paper_declined") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">
              Error loading notifications
            </div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-7 h-7 text-blue-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with your paper status and reviews
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read ({unreadCount})
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: "all", label: "All", count: notifications.length },
              { key: "unread", label: "Unread", count: unreadCount },
              { key: "read", label: "Read", count: null },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  filter === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "You're all caught up! New notifications will appear here."
                  : "Notifications about your papers and reviews will appear here."}
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border-b border-gray-100 last:border-b-0 ${
                    !notification.isRead ? "bg-blue-50" : "bg-white"
                  } hover:bg-gray-50 transition-colors duration-200`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`font-semibold ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}

                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationBadge(
                                notification.type,
                                notification.priority
                              )}`}
                            >
                              {notification.type.replace("_", " ")}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-3 break-words">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                              {formatDate(notification.createdAt)}
                            </p>

                            {notification.paperId && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Paper: {notification.paperId.ictacemId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification._id)
                          }
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm mt-6 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {notifications.length} of{" "}
                {pagination.totalNotifications} notifications
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="px-3 py-1 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
