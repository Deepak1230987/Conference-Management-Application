import React from "react";

/**
 * Quick actions panel component providing shortcuts for common admin tasks
 * @param {Object} props - Component props
 * @param {Function} props.onTabChange - Function to change tabs
 * @param {Object} props.stats - Statistics data object
 */
const QuickActionsPanel = ({ onTabChange, stats }) => {
  const quickActions = [
    {
      title: "Review Papers",
      description: "Review pending submissions",
      count: (stats.review_awaited || 0) + (stats.review_in_progress || 0),
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      action: () => onTabChange("papers"),
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      count: stats.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      action: () => onTabChange("users"),
    },
    {
      title: "View Statistics",
      description: "Detailed analytics and reports",
      count: "📊",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      action: () => onTabChange("stats"),
    },
    {
      title: "Export Data",
      description: "Download reports and data",
      count: "💾",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      action: () => {
        // TODO: Implement export functionality
        alert("Export functionality coming soon!");
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <svg
            className="w-6 h-6 text-indigo-600"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.bgColor} rounded-xl p-4 text-left hover:shadow-md transition-all duration-200 transform hover:scale-105 border border-transparent hover:border-gray-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 ${action.textColor} bg-white bg-opacity-50 rounded-lg`}
              >
                {action.icon}
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${action.textColor}`}>
                  {typeof action.count === "number"
                    ? action.count
                    : action.count}
                </span>
              </div>
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${action.textColor} mb-1`}>
                {action.title}
              </h4>
              <p className="text-xs text-gray-600">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">System Status</h4>
            <p className="text-sm text-gray-600">All systems operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
