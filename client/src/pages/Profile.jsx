import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../components/admin/Notification";
import ChatBox from "../components/ChatBox";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState(null);
  const [activeTab, setActiveTab] = useState("papers");
  const [paymentInputs, setPaymentInputs] = useState({});
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showFullPaperPrompt, setShowFullPaperPrompt] = useState(null);
  const [reUploadingPaper, setReUploadingPaper] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [showChatBox, setShowChatBox] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  // Fetch unread message counts
  const fetchUnreadCounts = async () => {
    try {
      console.log("Making API call to fetch unread counts...");
      const response = await fetch("/ictacem2025/api/chat/unread-counts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API response:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched unread counts:", data);

        if (data.success) {
          // Create a map of paper IDs to their unread counts
          const unreadMap = {};
          data.unreadSummary.forEach((item) => {
            unreadMap[item.paperId] = item.unreadCount;
          });
          console.log("Unread counts map:", unreadMap);
          console.log("Total unread messages:", data.totalUnread);

          setUnreadCounts(unreadMap);
          setTotalUnreadMessages(data.totalUnread);
        } else {
          console.log("API response not successful:", data);
        }
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  // Fetch user's submitted papers
  useEffect(() => {
    const fetchPapers = async () => {
      if (!user) return;

      try {
        setPapersLoading(true);
        const response = await axios.get("/api/papers/user");
        setPapers(response.data);

        // Initialize payment input states for each paper
        const inputs = {};
        response.data.forEach((paper) => {
          inputs[paper._id] = "";
        });
        setPaymentInputs(inputs);

        setPapersError(null);

        // Fetch unread counts after papers are loaded
        await fetchUnreadCounts();
      } catch (err) {
        console.error("Error fetching papers:", err);
        setPapersError(
          "Failed to load your submitted papers. Please try again later."
        );
      } finally {
        setPapersLoading(false);
      }
    };

    fetchPapers();
  }, [user]);

  // Poll for unread message updates every 30 seconds
  useEffect(() => {
    if (!user || loading) {
      console.log(
        "User not authenticated or still loading, skipping unread counts polling.",
        { user: !!user, loading }
      );
      return;
    }

    console.log("Setting up unread counts polling for user:", user.username);

    const interval = setInterval(() => {
      console.log("Polling for unread counts...");
      fetchUnreadCounts();
    }, 30000); // 30 seconds

    return () => {
      console.log("Cleaning up unread counts polling interval");
      clearInterval(interval);
    };
  }, [user, loading]);

  // Browser notification for new messages
  useEffect(() => {
    if (totalUnreadMessages > 0) {
      // Request notification permission if not already granted
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      // Show browser notification if permission is granted
      if (Notification.permission === "granted") {
        new Notification("ICTACEM 2025 - New Message", {
          body: `You have ${totalUnreadMessages} unread message(s) from admin`,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: "ictacem-chat",
        });
      }

      // Update page title to show unread count
      document.title = `(${totalUnreadMessages}) ICTACEM 2025 - Profile`;
    } else {
      // Reset page title when no unread messages
      document.title = "ICTACEM 2025 - Profile";
    }
  }, [totalUnreadMessages]);

  // Handle chat box close and refresh unread counts
  const handleChatClose = () => {
    setShowChatBox(false);
    setSelectedPaperId(null);
    // Refresh unread counts when chat is closed
    fetchUnreadCounts();
  };

  // Handle payment ID update
  const updatePaymentId = async (paperId) => {
    const paymentId = paymentInputs[paperId];

    if (!paymentId || paymentId.trim() === "") {
      setNotification({
        type: "error",
        message: "Please enter a valid payment ID",
      });
      return;
    }

    try {
      setUpdatingPayment(paperId);

      // Call API to update payment ID
      await axios.patch(`/api/papers/${paperId}/payment`, {
        paymentId: paymentId,
      });

      // Update papers list with new payment ID
      setPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === paperId ? { ...paper, paymentId: paymentId } : paper
        )
      );

      // Show success message
      setUpdateSuccess(paperId);
      setTimeout(() => setUpdateSuccess(null), 3000);

      // Display notification
      setNotification({
        type: "success",
        message: `Payment ID ${paymentId} has been successfully added to your paper.`,
      });

      // Clear the input field
      setPaymentInputs((prev) => ({
        ...prev,
        [paperId]: "",
      }));

      // Show the full paper prompt for this paper
      setShowFullPaperPrompt(paperId);
    } catch (err) {
      console.error("Error updating payment ID:", err);
      setNotification({
        type: "error",
        message: "Failed to update payment ID. Please try again later.",
      });
    } finally {
      setUpdatingPayment(null);
    }
  };

  // Handle input change for payment IDs
  const handlePaymentInputChange = (paperId, value) => {
    setPaymentInputs((prev) => ({
      ...prev,
      [paperId]: value,
    }));
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let styles =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    if (status === "abstract_accepted") {
      styles += " bg-green-100 text-green-800 border border-green-200";
    } else if (status === "declined") {
      styles += " bg-red-100 text-red-800 border border-red-200";
    } else if (status === "review_awaited") {
      styles += " bg-blue-100 text-blue-800 border border-blue-200";
    } else if (status === "review_in_progress") {
      styles += " bg-yellow-100 text-yellow-800 border border-yellow-200";
    } else if (status === "author_response_awaited") {
      styles += " bg-purple-100 text-purple-800 border border-purple-200";
    } else {
      styles += " bg-gray-100 text-gray-800 border border-gray-200";
    }

    const statusIcons = {
      abstract_accepted: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      declined: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      review_awaited: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      review_in_progress: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      author_response_awaited: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    const statusLabels = {
      review_awaited: "Review Awaited",
      review_in_progress: "Review in Progress",
      author_response_awaited: "Author Response Awaited",
      abstract_accepted: "Abstract Accepted",
      declined: "Declined",
    };

    return (
      <span className={styles}>
        {statusIcons[status]}
        {statusLabels[status] || status}
      </span>
    );
  };

  // Paper type tag component
  const ThemeTag = ({ theme }) => {
    // Map themes to colors for visual distinction
    const themeColors = {
      "Fluid Mechanics": "bg-blue-50 text-blue-700 border-blue-200",
      "Solid Mechanics and Dynamics":
        "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Propulsion and Combustion":
        "bg-orange-50 text-orange-700 border-orange-200",
      "Flight Mechanics, Control and Navigation":
        "bg-purple-50 text-purple-700 border-purple-200",
    };

    const colorClass =
      themeColors[theme] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClass}`}
      >
        {theme}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin absolute top-4 left-4"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              Loading your profile...
            </p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    setTimeout(() => {
      navigate("/login");
    }, 2000);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Authentication Required
              </h2>
              <p className="text-base text-gray-600 mb-4">
                You must be logged in to view your profile
              </p>
              <div className="flex items-center">
                <div className="animate-pulse rounded-full h-2 w-2 bg-red-500 mr-2"></div>
                <p className="text-sm text-red-600">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const papers_by_status = {
    review_awaited:
      papers?.filter((paper) => paper.status === "review_awaited") || [],
    review_in_progress:
      papers?.filter((paper) => paper.status === "review_in_progress") || [],
    author_response_awaited:
      papers?.filter((paper) => paper.status === "author_response_awaited") ||
      [],
    abstract_accepted:
      papers?.filter((paper) => paper.status === "abstract_accepted") || [],
    declined: papers?.filter((paper) => paper.status === "declined") || [],
  };

  // Handle abstract re-upload
  const handleAbstractReUpload = async (paperId) => {
    const selectedFile = selectedFiles[paperId]; // Get file specific to this paper

    if (!selectedFile) {
      setNotification({
        type: "error",
        message: "Please select a PDF file to upload",
      });
      return;
    }

    try {
      setReUploadingPaper(paperId);

      const formData = new FormData();
      formData.append("paperPdf", selectedFile);

      // Call API to re-upload abstract
      const response = await axios.post(
        `/api/papers/${paperId}/re-upload-abstract`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the response to debug
      console.log("Re-upload response:", response.data);

      // Update papers list with new data - handle different response structures
      setPapers((prevPapers) =>
        prevPapers.map((paper) => {
          if (paper._id === paperId) {
            // Handle the response data properly
            const updatedPaperData = response.data.paper || response.data;
            return {
              ...paper,
              pdfPath: updatedPaperData.pdfPath || "uploaded",
              status: updatedPaperData.status || "review_awaited",
              submittedAt: updatedPaperData.submittedAt || paper.submittedAt,
              review: updatedPaperData.review || "",
            };
          }
          return paper;
        })
      );

      // Display success notification
      setNotification({
        type: "success",
        message:
          "Abstract re-uploaded successfully! Your paper status has been updated to 'Review Awaited'.",
      });

      // Clear selected file for this specific paper
      setSelectedFiles((prev) => ({
        ...prev,
        [paperId]: null,
      }));
    } catch (err) {
      console.error("Error re-uploading abstract:", err);
      setNotification({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to re-upload abstract. Please try again later.",
      });
    } finally {
      setReUploadingPaper(null);
    }
  };

  // Handle file selection for re-upload
  const handleFileSelect = (event, paperId) => {
    // Added paperId parameter
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setNotification({
          type: "error",
          message: "Please select a PDF file only.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setNotification({
          type: "error",
          message: "File size must be less than 10MB.",
        });
        return;
      }
      // Set file for specific paper
      setSelectedFiles((prev) => ({
        ...prev,
        [paperId]: file,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 py-16">
      {/* Display notification */}
      {notification && <Notification error={notification} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Card with User Info */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-white opacity-10 rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-blue-300 opacity-20 rounded-full blur-2xl transform -translate-y-1/2"></div>
              <div className="relative">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                  <span>Welcome, {user?.username}</span>
                  {user?.role === "admin" && (
                    <span className="ml-3 bg-amber-400/20 backdrop-blur-sm text-amber-100 text-xs uppercase tracking-wider py-1 px-2 rounded-md border border-amber-300/30">
                      Admin
                    </span>
                  )}
                </h1>
                <div className="h-1 w-16 bg-blue-300 mb-4 rounded"></div>
                <p className="text-blue-100 text-lg max-w-lg">
                  Check your ICTACEM-2025 conference papers and profile details
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition duration-300">
                    <div className="text-sm font-medium text-gray-500">
                      Email Address
                    </div>
                    <div className="font-bold text-gray-800 flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {user?.email}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition duration-300">
                    <div className="text-sm font-medium text-gray-500">
                      ICTACEM-2025 ID
                    </div>
                    <div className="font-mono text-gray-800 flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      {user?.customUserId}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition duration-300">
                    <div className="text-sm font-medium text-gray-500">
                      Paper Submissions
                    </div>
                    <div className="font-medium text-gray-800 flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {papers.length} Paper{papers.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <button
                  onClick={() => navigate("/submit")}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Submit New Paper
                </button>
              </div>
            </div>
          </div>

          {/* Papers Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === "papers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("papers")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Your Papers
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {papers.length}
                </span>
              </button>
            </div>

            {activeTab === "papers" && (
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span>Your Submitted Papers</span>
                    {papers_by_status.abstract_accepted.length > 0 && (
                      <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                        {papers_by_status.abstract_accepted.length}{" "}
                        abstract_accepted
                      </span>
                    )}
                  </h2>

                  <div className="flex gap-2">
                    <div className="md:hidden">
                      <button
                        onClick={() => navigate("/submit-paper")}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        New Paper
                      </button>
                    </div>
                  </div>
                </div>

                {papersLoading ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">
                      Loading your submissions...
                    </p>
                  </div>
                ) : papersError ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error Loading Papers
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {papersError}
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-2 inline-flex items-center text-xs font-medium text-red-700 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                ) : papers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mb-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      No papers submitted yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8 text-center">
                      You haven't submitted any papers to the ICTACEM 2025
                      conference yet. Submit your research to share with the
                      aerospace community.
                    </p>
                    {/* <button
                      onClick={() => navigate("/submit-paper")}
                      className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Submit Your First Paper
                    </button> */}
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 text-sm">
                        <button className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md font-medium border border-blue-200">
                          All Papers ({papers.length})
                        </button>
                        {papers_by_status.review_awaited.length > 0 && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md font-medium border border-gray-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200">
                            Review Awaited (
                            {papers_by_status.review_awaited.length})
                          </button>
                        )}
                        {papers_by_status.review_in_progress.length > 0 && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md font-medium border border-gray-200 hover:bg-yellow-50 hover:text-yellow-800 hover:border-yellow-200">
                            In Progress (
                            {papers_by_status.review_in_progress.length})
                          </button>
                        )}
                        {papers_by_status.abstract_accepted.length > 0 && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md font-medium border border-gray-200 hover:bg-green-50 hover:text-green-800 hover:border-green-200">
                            Abstract accepted (
                            {papers_by_status.abstract_accepted.length})
                          </button>
                        )}
                        {papers_by_status.declined.length > 0 && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md font-medium border border-gray-200 hover:bg-red-50 hover:text-red-800 hover:border-red-200">
                            Declined ({papers_by_status.declined.length})
                          </button>
                        )}
                        {papers_by_status.author_response_awaited.length >
                          0 && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md font-medium border border-gray-200 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-200">
                            Response Awaited (
                            {papers_by_status.author_response_awaited.length})
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {papers.map((paper) => (
                        <div
                          key={paper._id}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-shadow overflow-hidden group"
                        >
                          <div
                            className={`h-1.5 ${
                              paper.status === "abstract_accepted"
                                ? "bg-emerald-500"
                                : paper.status === "rejected"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          ></div>
                          <div className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                              <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                  <StatusBadge status={paper.status} />
                                  <span className="text-gray-500 text-sm">
                                    Submitted on {formatDate(paper.submittedAt)}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {paper.title}
                                </h3>
                              </div>

                              <div className="hidden sm:flex items-center space-x-2 mt-2 sm:mt-0">
                                <ThemeTag theme={paper.theme} />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                  Authors
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {paper.authors.map((author, index) => (
                                    <div
                                      key={index}
                                      className="inline-flex items-center"
                                    >
                                      <span className="font-medium text-gray-800">
                                        {author.name}
                                        {index < paper.authors.length - 1 &&
                                          ","}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                  Mode of Presentation
                                </p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {paper.modeOfPresentation || "Not specified"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                  ICTACEM ID
                                </p>
                                <p className="font-mono text-gray-800">
                                  {paper.ictacemId}
                                </p>
                              </div>
                              <div className="flex sm:hidden items-center space-x-2 mt-2 sm:mt-0">
                                <ThemeTag theme={paper.theme} />
                              </div>
                            </div>

                            {/* Show Review Comments if available */}
                            {paper.review && (
                              <div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="flex items-center text-sm font-semibold text-blue-700 mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                  </svg>
                                  Review Comments
                                </h4>
                                <div className="bg-white p-3 rounded border border-blue-100 text-sm whitespace-pre-wrap text-gray-700">
                                  {paper.review}
                                </div>
                              </div>
                            )}

                            {/* Payment Section for approved papers */}
                            {paper.status === "abstract_accepted" && (
                              <div className="mt-4 mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                <h4 className="flex items-center text-sm font-semibold text-emerald-700 mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                  Payment Information
                                </h4>

                                {paper.paymentId && paper.paymentId !== "" ? (
                                  <div className="bg-white p-4 rounded border border-emerald-100 text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                      <span className="text-gray-600 mr-2">
                                        Payment ID:
                                      </span>
                                      <span className="font-mono font-medium text-gray-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                                        {paper.paymentId}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="bg-white p-4 rounded border border-emerald-100">
                                      <p className="text-sm text-emerald-700 mb-3">
                                        <span className="font-medium">
                                          Congratulations!
                                        </span>{" "}
                                        Your paper has been accepted. Please
                                        complete the payment to finalize your
                                        registration for the conference.
                                      </p>

                                      <div className="mb-4">
                                        <h5 className="font-medium text-gray-700 mb-2">
                                          Payment Action
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                            <div className="font-medium text-gray-800 mb-1">
                                              Note
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              <div>
                                                On clicking "Pay Now", you will
                                                be redirected to the payment
                                                portal. Please ensure that you
                                                complete the payment process to
                                                confirm your submisson.
                                              </div>
                                              <div className="mt-2">
                                                Once the payment is completed,
                                                fill your payment ID below.
                                              </div>
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                            <button
                                              onClick={() =>
                                                window.open("/paynow", "_blank")
                                              }
                                              className="w-full mt-2 inline-flex justify-center items-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                              </svg>
                                              Pay Now
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="text-sm text-gray-700 mb-2 font-medium">
                                          Already paid? Enter your payment ID
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                          <div className="relative flex-grow">
                                            <input
                                              type="text"
                                              placeholder="Enter Payment ID"
                                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                              value={paymentInputs[paper._id]}
                                              onChange={(e) =>
                                                handlePaymentInputChange(
                                                  paper._id,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <button
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none transition duration-200 flex items-center justify-center"
                                            onClick={() =>
                                              updatePaymentId(paper._id)
                                            }
                                            disabled={
                                              updatingPayment === paper._id
                                            }
                                          >
                                            {updatingPayment === paper._id ? (
                                              <svg
                                                className="animate-spin h-4 w-4 mr-1"
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
                                                ></circle>
                                                <path
                                                  className="opacity-75"
                                                  fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                              </svg>
                                            ) : (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            )}
                                            Submit
                                          </button>
                                        </div>
                                        {updateSuccess === paper._id && (
                                          <p className="text-sm text-emerald-700 mt-2 flex items-center">
                                            <svg
                                              className="h-4 w-4 mr-1"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            Payment ID updated successfully!
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-xs text-gray-500 flex items-center">
                                      <svg
                                        className="h-3 w-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      For payment-related queries, please
                                      contact finance@ictacem2025.org
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Admin Files Section - Show files that are visible to user */}
                            {paper.adminUploadedFiles &&
                              Array.isArray(paper.adminUploadedFiles) &&
                              paper.adminUploadedFiles.filter(
                                (file) => file.visibleToUser
                              ).length > 0 && (
                                <div className="mt-4 mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                  <h4 className="flex items-center text-sm font-semibold text-indigo-700 mb-3">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    Additional Documents from Admin
                                  </h4>
                                  <div className="space-y-3">
                                    {paper.adminUploadedFiles
                                      .filter((file) => file.visibleToUser)
                                      .map((file, index) => (
                                        <div
                                          key={file._id || index}
                                          className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center mb-2">
                                                <svg
                                                  className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
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
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                  {file.fileName}
                                                </p>
                                              </div>
                                              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize font-medium">
                                                  {file.fileType?.replace(
                                                    "_",
                                                    " "
                                                  ) || "Document"}
                                                </span>
                                                <span className="text-gray-500">
                                                  •
                                                </span>
                                                <span>
                                                  {new Date(
                                                    file.uploadedAt
                                                  ).toLocaleDateString("en-GB")}
                                                </span>
                                              </div>
                                              {file.description && (
                                                <p className="text-xs text-gray-600 mb-2">
                                                  {file.description}
                                                </p>
                                              )}
                                            </div>
                                            <button
                                              onClick={() =>
                                                window.open(
                                                  `/ictacem2025/api/admin/papers/${paper._id}/admin-files/${file._id}/view`,
                                                  "_blank"
                                                )
                                              }
                                              className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 transform hover:scale-105 shadow-sm flex items-center"
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
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="mt-3 text-xs text-indigo-600 flex items-center">
                                    <svg
                                      className="h-3 w-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    These documents have been provided by the
                                    conference administrators
                                  </div>
                                </div>
                              )}

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                              {/* View Abstract or Upload New Abstract Button */}
                              {paper.pdfPath ? (
                                <button
                                  onClick={() => {
                                    // Open PDF in a new browser tab
                                    window.open(
                                      `/ictacem2025/api/papers/view/${paper._id}`,
                                      "_blank"
                                    );
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
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
                              ) : (
                                <div className="flex flex-col gap-3">
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <h4 className="flex items-center text-sm font-semibold text-orange-700 mb-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                      </svg>
                                      Abstract Reset by Admin
                                    </h4>
                                    <p className="text-sm text-orange-700 mb-3">
                                      Your abstract has been reset by an
                                      administrator. Please upload a new
                                      abstract PDF to continue the review
                                      process.
                                    </p>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Select New Abstract PDF
                                        </label>
                                        <input
                                          type="file"
                                          accept=".pdf"
                                          onChange={(e) =>
                                            handleFileSelect(e, paper._id)
                                          }
                                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {selectedFiles[paper._id] && (
                                          <p className="mt-1 text-sm text-green-600">
                                            Selected:{" "}
                                            {selectedFiles[paper._id].name}
                                          </p>
                                        )}
                                      </div>

                                      <button
                                        onClick={() =>
                                          handleAbstractReUpload(paper._id)
                                        }
                                        disabled={
                                          !selectedFiles[paper._id] ||
                                          reUploadingPaper === paper._id
                                        }
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {reUploadingPaper === paper._id ? (
                                          <>
                                            <svg
                                              className="animate-spin h-4 w-4 mr-2"
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
                                              ></circle>
                                              <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              ></path>
                                            </svg>
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5 mr-2"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                              />
                                            </svg>
                                            Upload New Abstract
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* View Full Paper Button (if available) */}
                              {paper.fullPaperPdfPath && (
                                <button
                                  onClick={() => {
                                    // Open full paper PDF in a new browser tab
                                    window.open(
                                      `/ictacem2025/api/papers/view-full/${paper._id}`,
                                      "_blank"
                                    );
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
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
                                  View Full Paper
                                </button>
                              )}

                              {/* Submit Full Paper Button (if conditions met) */}
                              {paper.status === "abstract_accepted" &&
                                paper.paymentId &&
                                paper.paymentId !== "TXN123456789" &&
                                !paper.fullPaperPdfPath && (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/submit-full-paper/${paper._id}`
                                      )
                                    }
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                    Submit Full Paper
                                  </button>
                                )}

                              {/* Chat with Admin Button */}
                              <button
                                onClick={() => {
                                  setSelectedPaperId(paper._id);
                                  setShowChatBox(true);
                                }}
                                className="relative inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200"
                              >
                                <svg
                                  className="h-5 w-5 mr-2"
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
                                Ask Doubts
                                {/* Unread message badge */}
                                {unreadCounts[paper._id] > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                    {unreadCounts[paper._id]}
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Custom prompt for full paper submission */}
      {showFullPaperPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient decoration */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-blue-100/20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 rounded-full bg-purple-100/20 blur-xl"></div>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m0 0H7a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v9a2 2 0 01-2 2h-1"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Submit Full-Length Paper
                </h3>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
              </div>

              <div className="mb-8 text-gray-600 dark:text-gray-300 text-center">
                <p className="mb-4">
                  Would you like to complete the next step and submit your
                  full-length paper?
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Note:</span> You can also
                    submit your full paper later from your profile page.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    navigate(`/submit-full-paper/${showFullPaperPrompt}`);
                    setShowFullPaperPrompt(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Yes, Submit Now
                </button>

                <button
                  onClick={() => setShowFullPaperPrompt(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Chat Box */}
      {showChatBox && selectedPaperId && (
        <ChatBox
          paperId={selectedPaperId}
          currentUser={user}
          onClose={handleChatClose}
          isVisible={showChatBox}
        />
      )}
    </div>
  );
};

export default Profile;
