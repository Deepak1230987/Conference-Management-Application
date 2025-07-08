import React from "react";

/**
 * User engagement metrics component showing user activity and engagement statistics
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {Array} props.recentPapers - Array of recent paper submissions
 */
const UserEngagementMetrics = ({ stats, recentPapers = [] }) => {
  // Helper function to calculate percentage
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Calculate engagement metrics
  const totalUsers = stats.totalUsers || 0;
  const activeUsers = recentPapers.length; // Users who have submitted papers
  const engagementRate = getPercentage(activeUsers, totalUsers);

  // Get recent activity data (last 7 days)
  const getRecentActivity = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return recentPapers.filter((paper) => {
      const submissionDate = new Date(paper.submittedAt);
      return submissionDate >= sevenDaysAgo;
    }).length;
  };

  const recentActivity = getRecentActivity();

  // Engagement data
  const engagementData = [
    {
      metric: "User Engagement",
      value: `${engagementRate}%`,
      description: `${activeUsers} of ${totalUsers} users`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      metric: "Active This Week",
      value: recentActivity,
      description: "New submissions",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      metric: "Total Users",
      value: totalUsers,
      description: "Registered users",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      metric: "Submissions per User",
      value:
        totalUsers > 0 ? (recentPapers.length / totalUsers).toFixed(1) : "0.0",
      description: "Average submissions",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">User Engagement</h3>
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>

      {/* Engagement Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {engagementData.map((data, index) => (
          <div key={index} className={`${data.bgColor} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 ${data.textColor} bg-white bg-opacity-50 rounded-lg`}
              >
                {data.icon}
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${data.textColor}`}>
                  {data.value}
                </p>
              </div>
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${data.textColor} mb-1`}>
                {data.metric}
              </h4>
              <p className="text-xs text-gray-600">{data.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            User Engagement Rate
          </span>
          <span className="text-sm text-gray-500">{engagementRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${engagementRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Active Users</p>
          <p className="text-xl font-bold text-gray-900">{activeUsers}</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Weekly Activity</p>
          <p className="text-xl font-bold text-gray-900">{recentActivity}</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Engagement</p>
          <p className="text-xl font-bold text-gray-900">{engagementRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementMetrics;
