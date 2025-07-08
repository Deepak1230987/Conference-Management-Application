import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminHeader";
import PaperCard from "./PaperCard";
import Notification from "./Notification";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [userDetails, setUserDetails] = useState(null);
  const [userPapers, setUserPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePaper, setActivePaper] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Check admin access
  const isAdmin = user?.role === "admin" || user?.user?.role === "admin";

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/ictacem2025/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUserDetails(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError({ type: "error", message: "Failed to load user details" });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserPapers = useCallback(async () => {
    try {
      const response = await fetch(
        `/ictacem2025/api/admin/users/${userId}/papers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user papers");
      }

      const data = await response.json();
      setUserPapers(data.papers || []);
    } catch (error) {
      console.error("Error fetching user papers:", error);
      setError({ type: "error", message: "Failed to load user papers" });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Wait for auth to load before checking authentication
    if (authLoading) return;

    if (!isAuthenticated || !isAdmin) {
      navigate("/admin");
      return;
    }
    fetchUserDetails();
    fetchUserPapers();
  }, [
    fetchUserDetails,
    fetchUserPapers,
    isAuthenticated,
    isAdmin,
    navigate,
    authLoading,
  ]);

  const updatePaperStatus = async (
    paperId,
    status,
    errorSetter,
    reviewText
  ) => {
    try {
      const response = await fetch(
        `/ictacem2025/api/admin/papers/${paperId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status, review: reviewText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update paper status");
      }

      const updatedPaper = await response.json();

      // Update the paper in the local state
      setUserPapers((prevPapers) =>
        prevPapers.map((paper) =>
          paper._id === paperId ? updatedPaper : paper
        )
      );

      setError({
        type: "success",
        message: "Paper status updated successfully",
      });
      setActivePaper(null);
    } catch (error) {
      console.error("Error updating paper status:", error);
      setError({ type: "error", message: "Failed to update paper status" });
    }
  };

  const toggleSubmission = async (paperId, type, reset) => {
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

      // Update the paper in local state
      setUserPapers((prevPapers) =>
        prevPapers.map((paper) => (paper._id === paperId ? data.paper : paper))
      );

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusStats = () => {
    const stats = {
      total: userPapers.length,
      accepted: userPapers.filter((p) => p.status === "abstract_accepted")
        .length,
      pending: userPapers.filter(
        (p) =>
          p.status === "review_awaited" || p.status === "review_in_progress"
      ).length,
      declined: userPapers.filter((p) => p.status === "declined").length,
      withFullPaper: userPapers.filter((p) => p.fullPaperPdfPath).length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminHeader user={user} />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Loading user profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminHeader user={user} />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The requested user profile could not be located.
            </p>
            <button
              onClick={() => navigate("/admin")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminHeader user={user} />

      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Notification */}
        <Notification error={error} />

        {/* Breadcrumb */}
        <nav
          className="flex items-center space-x-2 mb-8"
          aria-label="Breadcrumb"
        >
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
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
          <span className="text-gray-700 font-medium">User Profile</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Avatar & Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {getInitials(userDetails.username)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {userDetails.username}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  {userDetails.email}
                </p>
                <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                  <span className="text-xs font-mono text-gray-700">
                    ID: {userDetails.customUserId}
                  </span>
                </div>
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active User
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
              <nav className="space-y-1">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
                  },
                  {
                    id: "papers",
                    label: "Papers",
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  },
                  {
                    id: "activity",
                    label: "Activity",
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
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
                        d={tab.icon}
                      />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Papers</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    {stats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Accepted</span>
                  <span className="font-bold text-lg text-green-600">
                    {stats.accepted}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Under Review</span>
                  <span className="font-bold text-lg text-yellow-600">
                    {stats.pending}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Full Papers</span>
                  <span className="font-bold text-lg text-blue-600">
                    {stats.withFullPaper}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-indigo-600"
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
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="border-l-4 border-indigo-500 pl-4">
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <p className="text-lg font-medium text-gray-900">
                          {userDetails.username}
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <p className="text-lg font-medium text-gray-900">
                          {userDetails.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          User ID
                        </label>
                        <p className="text-lg font-mono font-medium text-gray-900">
                          {userDetails.customUserId}
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Registration Date
                        </label>
                        <p className="text-lg font-medium text-gray-900">
                          {formatDate(userDetails.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Total Submissions",
                      value: stats.total,
                      color: "indigo",
                      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    },
                    {
                      label: "Accepted Papers",
                      value: stats.accepted,
                      color: "green",
                      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Under Review",
                      value: stats.pending,
                      color: "yellow",
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      label: "Full Papers",
                      value: stats.withFullPaper,
                      color: "blue",
                      icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-2xl p-6 border border-${stat.color}-200 shadow-lg`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center shadow-lg`}
                        >
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
                              d={stat.icon}
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p
                            className={`text-${stat.color}-600 text-sm font-semibold`}
                          >
                            {stat.label}
                          </p>
                          <p
                            className={`text-${stat.color}-900 text-2xl font-bold`}
                          >
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "papers" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-indigo-600"
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
                    Submitted Papers ({userPapers.length})
                  </h3>
                </div>

                <div className="p-8">
                  {userPapers.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        No Papers Yet
                      </h4>
                      <p className="text-gray-600">
                        This user hasn't submitted any papers to the conference.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userPapers.map((paper) => (
                        <PaperCard
                          key={paper._id}
                          paper={paper}
                          activePaper={activePaper}
                          setActivePaper={setActivePaper}
                          setError={setError}
                          onToggleSubmission={toggleSubmission}
                          onPaperUpdate={(updatedPaper) => {
                            // Update the paper in local state
                            setUserPapers((prevPapers) =>
                              prevPapers.map((p) =>
                                p._id === updatedPaper._id ? updatedPaper : p
                              )
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-indigo-600"
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
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">
                        Account Created
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formatDate(userDetails.createdAt)}
                      </p>
                    </div>
                  </div>
                  {userPapers.map((paper, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">
                          Paper Submitted: {paper.title}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {formatDate(paper.submittedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
