import React, { useState } from "react";
import EnhancedDashboardStats from "./EnhancedDashboardStats";
import SubmissionAnalytics from "./SubmissionAnalytics";
import UserEngagementMetrics from "./UserEngagementMetrics";
import PaymentStatusTable from "./PaymentStatusTable";
import EvaluationStatusTable from "./EvaluationStatusTable";
import PresentationModeChart from "./PresentationModeChart";
import ThemeDistributionChart from "./ThemeDistributionChart";
import StatusDistributionChart from "./StatusDistributionChart";
import RecentActivities from "./RecentActivities";

const DashboardContent = ({
  stats,
  allPapers,
  users,
  themeDistribution,
  themes,
  recentSubmissions,
}) => {
  const [activeSection, setActiveSection] = useState("overview");

  const dashboardSections = [
    {
      id: "overview",
      name: "Overview",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "financial",
      name: "Financial",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: "evaluation",
      name: "Evaluation",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-hidden  ">
      {/* Dashboard Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive overview of ICTACEM 2025 conference management
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap space-x-1 bg-gray-100 rounded-lg p-1">
            {dashboardSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {section.icon}
                <span className="hidden sm:inline">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* Enhanced Dashboard Stats */}
            <EnhancedDashboardStats stats={stats} />

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <SubmissionAnalytics
                stats={stats}
                totalPapers={allPapers.length}
              />
              <UserEngagementMetrics
                stats={stats}
                recentPapers={recentSubmissions}
              />
            </div>

            {/* Status and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <StatusDistributionChart stats={stats} />
              </div>
              <div className="lg:col-span-2">
                <RecentActivities recentPapers={recentSubmissions} />
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Theme Distribution Chart */}
              <ThemeDistributionChart
                themeDistribution={themeDistribution}
                themes={themes}
                totalPapers={allPapers.length}
              />

              {/* Presentation Mode Chart */}
              <PresentationModeChart
                presentationModes={stats.presentationModes}
                totalPapers={allPapers.length}
              />
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <SubmissionAnalytics
                stats={stats}
                totalPapers={allPapers.length}
              />
              <UserEngagementMetrics
                stats={stats}
                recentPapers={recentSubmissions}
              />
            </div>
          </div>
        )}

        {/* Financial Section */}
        {activeSection === "financial" && (
          <div className="space-y-4 sm:space-y-6">
            <PaymentStatusTable users={users} papers={allPapers} />
          </div>
        )}

        {/* Evaluation Section */}
        {activeSection === "evaluation" && (
          <div className="space-y-4 sm:space-y-6">
            <EvaluationStatusTable users={users} papers={allPapers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
