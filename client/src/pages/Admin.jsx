import React, { useState, useEffect } from "react";

// Import custom hooks
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { usePapers } from "../hooks/usePapers";
import { useAdminStats } from "../hooks/useAdminStats";

// Import admin components
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardContent from "../components/admin/DashboardContent";
import UsersContent from "../components/admin/UsersContent";
import PapersContent from "../components/admin/PapersContent";
import Notification from "../components/admin/Notification";

const Admin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard"); // 'dashboard', 'users', 'papers', 'stats'
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle

  // Initialize custom hooks
  const {
    users,
    papers,
    expandedUser,
    isLoading: usersLoading,
    error: usersError,

    searchQuery,
    setSearchQuery,
    fetchUsers,
    fetchUserPapers,
    updatePaperInUserState,
    filteredUsers,
  } = useUsers();

  // Initialize papers hook
  const {
    allPapers,
    isLoading: papersLoading,
    error: papersError,
    reviewText,
    setReviewText,
    activePaper,
    setActivePaper,
    filter,
    setFilter,
    themeFilter,
    setThemeFilter,
    modeOfPresentationFilter,
    setModeOfPresentationFilter,
    paperSearchQuery,
    setPaperSearchQuery,
    fetchAllPapers,
    updatePaperStatus,
    downloadPaper,
    toggleSubmission,
    filterPapers,
    filteredAllPapers,
  } = usePapers();

  // Combine error states for notifications
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set global error from various sources
    if (usersError) setError(usersError);
    else if (papersError) setError(papersError);
    else setError(null);

    // Clear error after a delay if it's a success message
    if (error && error.type === "success") {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [usersError, papersError, error]);

  // Initialize admin stats hook
  const {
    stats,
    themes,
    calculateNewStats,
    themeDistribution,
    recentSubmissions,
  } = useAdminStats(allPapers, users.length);

  // Debug logging
  console.log("Admin component - users.length:", users.length);
  console.log("Admin component - allPapers.length:", allPapers.length);
  console.log("Admin component - stats:", stats);

  // Update stats whenever allPapers or users change
  useEffect(() => {
    calculateNewStats();
  }, [allPapers, users, calculateNewStats]);

  useEffect(() => {
    // Fetch data only if user is authenticated and is admin
    if (
      isAuthenticated &&
      (user?.role === "admin" || user?.user?.role === "admin")
    ) {
      fetchUsers();
      fetchAllPapers();
    }
  }, [isAuthenticated, user, fetchUsers, fetchAllPapers]);

  // If user is not authenticated or loading, show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-700">
          Loading admin dashboard...
        </span>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.user?.role === "admin";

  // If not admin, show access denied message
  if (!isAdmin) {
    console.log("Access denied - User is not admin. User data:", user);
    return (
      <div className="max-w-3xl mx-auto mt-10 p-5 bg-red-50 border border-red-200 rounded-md">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h1>
        <p className="mb-4">
          You don't have permission to access the admin area.
        </p>
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <h2 className="font-semibold mb-2">Debug Information:</h2>
          <p>
            <strong>User authenticated:</strong>{" "}
            {isAuthenticated ? "Yes" : "No"}
          </p>
          <p>
            <strong>User object:</strong> {user ? "Present" : "Missing"}
          </p>
          <p>
            <strong>User role:</strong> {user?.role || "undefined"}
          </p>
          <p>
            <strong>Nested user role:</strong> {user?.user?.role || "undefined"}
          </p>
        </div>
        <button
          onClick={() =>
            (window.location.href = "http://10.25.32.177/ictacem2025")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  // Main admin dashboard UI
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Admin Header - Fixed at top */}
      <AdminHeader user={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Fixed */}
        <div className="flex-shrink-0 hidden lg:block">
          <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
              <AdminSidebar
                currentTab={currentTab}
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  setSidebarOpen(false);
                }}
                onClose={() => setSidebarOpen(false)}
                className=" fixed top-0 h-full overflow-y-auto"
              />
            </div>
          </div>
        )}

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Sidebar Toggle */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          {/* Notification */}
          <div className="flex-shrink-0 px-6 pt-4">
            <Notification error={error} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              {/* Content Loading State */}
              {usersLoading || papersLoading ? (
                <div className="flex justify-center items-center min-h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <span className="text-lg text-gray-700">
                      Loading data...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Dashboard Tab */}
                  {currentTab === "dashboard" && (
                    <DashboardContent
                      stats={stats}
                      allPapers={allPapers}
                      users={users}
                      themeDistribution={themeDistribution}
                      themes={themes}
                      recentSubmissions={recentSubmissions}
                    />
                  )}

                  {/* Users Tab */}
                  {currentTab === "users" && (
                    <UsersContent
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filter={filter}
                      setFilter={setFilter}
                      themeFilter={themeFilter}
                      setThemeFilter={setThemeFilter}
                      themes={themes}
                      filteredUsers={filteredUsers}
                      fetchUserPapers={fetchUserPapers}
                      papers={papers}
                      expandedUser={expandedUser}
                      filterPapers={filterPapers}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      activePaper={activePaper}
                      setActivePaper={setActivePaper}
                      updatePaperStatus={(
                        paperId,
                        status,
                        errorSetter,
                        localReviewText
                      ) =>
                        updatePaperStatus(
                          paperId,
                          status,
                          setError,
                          localReviewText,
                          updatePaperInUserState
                        )
                      }
                      downloadPaper={(paperId) =>
                        downloadPaper(paperId, setError)
                      }
                      setError={setError}
                      updatePaperInUserState={updatePaperInUserState}
                      toggleSubmission={toggleSubmission}
                    />
                  )}

                  {/* Papers Tab */}
                  {currentTab === "papers" && (
                    <PapersContent
                      paperSearchQuery={paperSearchQuery}
                      setPaperSearchQuery={setPaperSearchQuery}
                      filter={filter}
                      setFilter={setFilter}
                      themeFilter={themeFilter}
                      setThemeFilter={setThemeFilter}
                      modeOfPresentationFilter={modeOfPresentationFilter}
                      setModeOfPresentationFilter={setModeOfPresentationFilter}
                      themes={themes}
                      filteredAllPapers={filteredAllPapers}
                      activePaper={activePaper}
                      setActivePaper={setActivePaper}
                      setError={setError}
                      toggleSubmission={toggleSubmission}
                      fetchAllPapers={fetchAllPapers}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
