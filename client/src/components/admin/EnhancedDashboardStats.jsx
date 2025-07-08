import React from "react";

/**
 * Enhanced dashboard statistics component with detailed metrics and modern design
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 */
const EnhancedDashboardStats = ({ stats }) => {
  console.log("EnhancedDashboardStats stats:", stats);

  // Helper function to calculate percentage
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Papers */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Total Papers
              </p>
              <p className="text-3xl font-bold mt-1">{stats.total || 0}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Accepted Papers */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Accepted</p>
              <p className="text-3xl font-bold mt-1">
                {stats.abstract_accepted || 0}
              </p>
              <p className="text-green-100 text-xs mt-1">
                {getPercentage(stats.abstract_accepted, stats.total)}% of total
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Declined Papers */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Declined</p>
              <p className="text-3xl font-bold mt-1">{stats.declined || 0}</p>
              <p className="text-red-100 text-xs mt-1">
                {getPercentage(stats.declined, stats.total)}% of total
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Review Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Review Awaited */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Review Awaited
            </h3>
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.review_awaited || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Pending review</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-amber-600">
                {getPercentage(stats.review_awaited, stats.total)}%
              </p>
            </div>
          </div>
        </div>

        {/* Review In Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.review_in_progress || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Being reviewed</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">
                {getPercentage(stats.review_in_progress, stats.total)}%
              </p>
            </div>
          </div>
        </div>

        {/* Author Response Awaited */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Author Response
            </h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.author_response_awaited || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-purple-600">
                {getPercentage(stats.author_response_awaited, stats.total)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Submission & Payment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paper Submission Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Paper Submissions
            </h3>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6.5a2 2 0 01-1.5 1.94l-.5.05a2 2 0 00-1.5 1.94V16a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm5 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Full Papers Submitted
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.fullPaperSubmitted || 0}
                </p>
              </div>
              <div className="text-green-700">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Abstract Only
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.abstractOnlySubmitted || 0}
                </p>
              </div>
              <div className="text-blue-700">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Payment Status
            </h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Payment Completed
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.paymentCompleted || 0}
                </p>
              </div>
              <div className="text-green-700">
                <span className="text-sm font-medium">
                  {getPercentage(stats.paymentCompleted, stats.total)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Payment Pending
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {stats.pendingPayment || 0}
                </p>
              </div>
              <div className="text-orange-700">
                <span className="text-sm font-medium">
                  {getPercentage(stats.pendingPayment, stats.total)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default EnhancedDashboardStats;
