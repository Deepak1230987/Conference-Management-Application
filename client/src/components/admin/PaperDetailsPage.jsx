import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminEvaluationPanel from "./AdminEvaluationPanel";
import Notification from "./Notification";
import SubmissionHistoryModal from "./SubmissionHistoryModal";
import AdminFileUpload from "./AdminFileUpload";
import ChatBox from "../ChatBox";

const PaperDetailsPage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [paper, setPaper] = useState(null);
  const [paperUser, setPaperUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("details");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check admin access
  const isAdmin = user?.role === "admin" || user?.user?.role === "admin";

  // Fetch unread message count for this paper
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/ictacem2025/api/chat/unread-counts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const paperUnread = data.unreadSummary.find(
            (item) => item.paperId === paperId
          );
          setUnreadCount(paperUnread ? paperUnread.unreadCount : 0);
        }
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Fetch paper details
  const fetchPaperDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/ictacem2025/api/admin/papers/${paperId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch paper details");
      }

      const data = await response.json();
      setPaper(data.paper);
      setPaperUser(data.user);
      setReviewText(data.paper.review || "");
      setSelectedStatus(data.paper.status);

      // Fetch unread count after paper details are loaded
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error fetching paper details:", error);
      setError({ type: "error", message: "Failed to load paper details" });
    } finally {
      setLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    // Wait for auth to load before checking authentication
    if (authLoading) return;

    if (!isAuthenticated || !isAdmin) {
      navigate("/admin");
      return;
    }
    fetchPaperDetails();
  }, [fetchPaperDetails, isAuthenticated, isAdmin, navigate, authLoading]);

  // Update paper status
  const updatePaperStatus = async () => {
    setIsSubmitting(true);
    try {
      // Create the data object with both status and review
      const reviewData = {
        status: selectedStatus,
        review: reviewText || "",
      };

      console.log("Updating paper status:", selectedStatus);
      console.log("Updating paper review:", reviewText);
      console.log("Sending to API:", reviewData);

      const response = await fetch(
        `/ictacem2025/api/admin/papers/${paperId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update paper status");
      }

      const updatedPaper = await response.json();
      console.log("API response:", updatedPaper);

      setPaper(updatedPaper);
      setError({
        type: "success",
        message: `Paper status updated to ${selectedStatus}${
          reviewText ? " with review comments" : ""
        }`,
      });
    } catch (error) {
      console.error("Error updating paper status:", error);
      setError({
        type: "error",
        message: `Failed to update paper status: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSubmission = async (type, reset) => {
    try {
      const endpoint =
        type === "abstract"
          ? `/ictacem2025/api/admin/papers/${paperId}/toggle-abstract`
          : `/ictacem2025/api/admin/papers/${paperId}/toggle-fullpaper`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          resetAbstract: type === "abstract" ? reset : undefined,
          resetFullPaper: type === "fullpaper" ? reset : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle ${type} submission`);
      }

      const data = await response.json();
      setPaper(data.paper);
      setError({
        type: "success",
        message:
          data.message ||
          `${type} submission ${reset ? "reset" : "restored"} successfully`,
      });
    } catch (error) {
      console.error(`Error toggling ${type} submission:`, error);
      setError({
        type: "error",
        message: `Failed to toggle ${type} submission`,
      });
    }
  };

  // Status configurations
  const statusConfig = {
    review_awaited: {
      color: "blue",
      label: "Review Awaited",
      bg: "bg-blue-600",
      text: "text-blue-900",
      light: "bg-blue-50",
      border: "border-blue-200",
    },
    review_in_progress: {
      color: "amber",
      label: "Review in Progress",
      bg: "bg-amber-600",
      text: "text-amber-900",
      light: "bg-amber-50",
      border: "border-amber-200",
    },
    author_response_awaited: {
      color: "purple",
      label: "Author Response Awaited",
      bg: "bg-purple-600",
      text: "text-purple-900",
      light: "bg-purple-50",
      border: "border-purple-200",
    },
    abstract_accepted: {
      color: "emerald",
      label: "Abstract Accepted",
      bg: "bg-emerald-600",
      text: "text-emerald-900",
      light: "bg-emerald-50",
      border: "border-emerald-200",
    },
    declined: {
      color: "rose",
      label: "Declined",
      bg: "bg-rose-600",
      text: "text-rose-900",
      light: "bg-rose-50",
      border: "border-rose-200",
    },
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid date";

      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Add the delete handler function in the proper location
  const handleDeleteAdminFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(
        `/ictacem2025/api/admin/papers/${paper._id}/admin-files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Update the paper state by removing the deleted file
      setPaper((prevPaper) => ({
        ...prevPaper,
        adminUploadedFiles: (prevPaper.adminUploadedFiles || []).filter(
          (file) => file._id !== fileId
        ),
      }));

      setError({
        type: "success",
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin file:", error);
      setError({
        type: "error",
        message: "Failed to delete file. Please try again.",
      });
    }
  };

  // Poll for unread message updates every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin, paperId]);

  // Handle chat box close and refresh unread count
  const handleChatClose = () => {
    setShowChatBox(false);
    setUnreadCount(0); // Reset unread count when chat is closed
    // Add a small delay to ensure the server has processed the read status update
    setTimeout(() => {
      fetchUnreadCount();
    }, 500); // 500ms delay
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <AdminHeader user={user} />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-orange-200 mx-auto"></div>
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-800">
              Loading paper details...
            </p>
            <p className="text-gray-600">
              Please wait while we fetch the information
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <AdminHeader user={user} />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paper Not Found
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              The requested paper could not be found in our database.
            </p>
            <button
              onClick={() => navigate("/admin")}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus =
    statusConfig[paper.status] || statusConfig.review_awaited;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <AdminHeader user={user} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Notification */}
        <Notification error={error} />

        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav
            className="flex items-center space-x-3 mb-6"
            aria-label="Breadcrumb"
          >
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors group"
            >
              <svg
                className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Admin Dashboard
            </button>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 font-medium">Paper Review</span>
          </nav>

          {/* Paper Title & Status Hero */}
          <div className="bg-gradient-to-r from-white to-orange-50 rounded-3xl p-8 border border-orange-200 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`px-4 py-2 rounded-full ${currentStatus.light} ${currentStatus.border} border-2`}
                  >
                    <span
                      className={`font-bold text-sm ${currentStatus.text} uppercase tracking-wider`}
                    >
                      {currentStatus.label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-mono bg-orange-100 px-3 py-1 rounded-lg border border-orange-200">
                    ID: {paper.ictacemId}
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {paper.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {paper.theme}
                  </div>
                  <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatDate(paper.submittedAt)}
                  </div>
                  <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {(paper.authors || []).length} Author
                    {(paper.authors || []).length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {/* View Abstract Button */}
                {paper.pdfPath && (
                  <button
                    onClick={() => {
                      window.open(
                        `/ictacem2025/api/papers/view/${paper._id}`,
                        "_blank"
                      );
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Abstract
                  </button>
                )}

                {/* View Full Paper Button */}
                {paper.fullPaperPdfPath && (
                  <button
                    onClick={() => {
                      window.open(
                        `/ictacem2025/api/papers/view-full/${paper._id}`,
                        "_blank"
                      );
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Full Paper
                  </button>
                )}

                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submission History
                </button>
                <button
                  onClick={() => setShowChatBox(true)}
                  className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Chat with Author
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-lg">
            {[
              {
                id: "details",
                label: "Paper Details",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                id: "authors",
                label: "Authors",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                id: "submitter",
                label: "Communicating Author",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              },
              {
                id: "review",
                label: "Confidential Notes and Marks",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeSection === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeSection === "details" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Paper Information
                </h2>

                {/* Current Review Comments Section - prominently displayed */}
                {paper.review && paper.review.trim() && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Current Review Comments
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {paper.review}
                      </p>
                    </div>
                    {paper.adminEvaluation?.reviewedBy &&
                      paper.adminEvaluation?.reviewedAt && (
                        <div className="mt-3 text-sm text-blue-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Last updated:{" "}
                          {formatDate(paper.adminEvaluation.reviewedAt)}
                        </div>
                      )}
                  </div>
                )}

                {/* Paper Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                      <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                        ICTACEM ID
                      </label>
                      <p className="text-lg font-mono text-gray-900">
                        {paper.ictacemId}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                      <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                        Payment ID
                      </label>
                      <p className="text-lg font-mono text-gray-900">
                        {paper.paymentId}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                      <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                        Theme
                      </label>
                      <p className="text-lg text-gray-900">{paper.theme}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                      <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                        Mode of Presentation
                      </label>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {paper.modeOfPresentation || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                      <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                        Submitted
                      </label>
                      <p className="text-lg text-gray-900">
                        {formatDate(paper.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {paper.fullPaperSubmittedAt && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-300 mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-emerald-700 font-semibold text-lg">
                          Full Paper Submitted
                        </p>
                        <p className="text-emerald-600">
                          {formatDate(paper.fullPaperSubmittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "authors" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Authors ({(paper.authors || []).length})
                </h2>

                <div className="grid gap-4">
                  {(paper.authors || []).map((author, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-6 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {getInitials(author.name)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {author.name}
                          </h3>
                          {author.affiliation && (
                            <p className="text-gray-700 mb-1">
                              {author.affiliation}
                            </p>
                          )}
                          {author.address && (
                            <p className="text-gray-600 text-sm">
                              {author.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "submitter" && paperUser && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Submitted By
                </h2>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <span className="text-white font-bold text-2xl">
                          {getInitials(paperUser.username)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {paperUser.username}
                        </h3>
                        <p className="text-gray-700 mb-1">{paperUser.email}</p>
                        <p className="text-gray-600 text-sm font-mono">
                          ID: {paperUser.customUserId}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/user/${paperUser._id}`)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "review" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Admin Evaluation Panel
                </h2>
                <AdminEvaluationPanel paper={paper} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Review Panel */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Review & Status
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Review Comments
                  </label>
                  <textarea
                    rows="6"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Add detailed review comments for the author..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Set Status
                  </label>
                  <div className="space-y-2">
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedStatus(value)}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          selectedStatus === value
                            ? `${config.bg} text-white shadow-lg transform scale-105`
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={updatePaperStatus}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update Review
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submission Management */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Submission Controls
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Abstract Reset */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Abstract</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        paper.pdfPath
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {paper.pdfPath ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Reset to allow re-upload
                  </p>
                  <button
                    onClick={() => toggleSubmission("abstract", true)}
                    disabled={!paper.pdfPath}
                    className={`w-full py-2 px-3 text-sm font-semibold rounded-xl transition-all ${
                      !paper.pdfPath
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    Reset Abstract
                  </button>
                </div>

                {/* Full Paper Reset */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Full Paper</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        paper.fullPaperPdfPath
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {paper.fullPaperPdfPath ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Reset to allow re-upload
                  </p>
                  <button
                    onClick={() => toggleSubmission("fullpaper", true)}
                    disabled={!paper.fullPaperPdfPath}
                    className={`w-full py-2 px-3 text-sm font-semibold rounded-xl transition-all ${
                      !paper.fullPaperPdfPath
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    Reset Full Paper
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Files Section */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Admin Files
                  </h3>
                  <button
                    onClick={() => setShowFileUpload(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload File
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Display admin uploaded files */}
                {paper.adminUploadedFiles &&
                Array.isArray(paper.adminUploadedFiles) &&
                paper.adminUploadedFiles.length > 0 ? (
                  <div className="space-y-3">
                    {paper.adminUploadedFiles.map((file, index) => (
                      <div
                        key={file._id || index}
                        className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-4 border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {file.fileName}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded capitalize font-medium">
                                    {file.fileType?.replace("_", " ")}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded font-medium ${
                                      file.visibleToUser
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {file.visibleToUser
                                      ? "Visible to user"
                                      : "Admin only"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {file.description && (
                              <p className="text-xs text-gray-600 mb-3 ml-11">
                                {file.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 ml-11">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/ictacem2025/api/admin/papers/${paper._id}/admin-files/${file._id}/view`,
                                    "_blank"
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 shadow-sm flex items-center"
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteAdminFile(file._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 shadow-sm flex items-center"
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      No admin files uploaded yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload additional documents, revisions, or notes for this
                      paper
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin File Upload Modal */}
        {showFileUpload && (
          <AdminFileUpload
            paperId={paper._id}
            onClose={() => setShowFileUpload(false)}
            onFileUploaded={(updatedPaper) => {
              setPaper(updatedPaper);
              setShowFileUpload(false);
              setError({
                type: "success",
                message: "File uploaded successfully",
              });
            }}
          />
        )}

        {/* Submission History Modal */}
        <SubmissionHistoryModal
          paperId={paperId}
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />

        {/* Chat Box */}
        {showChatBox && (
          <ChatBox
            paperId={paper._id}
            currentUser={user}
            onClose={handleChatClose}
            isVisible={showChatBox}
          />
        )}
      </div>
    </div>
  );
};

export default PaperDetailsPage;
