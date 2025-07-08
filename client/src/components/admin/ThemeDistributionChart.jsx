import React from "react";

/**
 * Enhanced theme distribution chart component for the admin dashboard
 * @param {Object} props - Component props
 * @param {Object} props.themeDistribution - The distribution of papers by theme
 * @param {Array} props.themes - Array of available themes
 * @param {number} props.totalPapers - Total number of papers
 */
const ThemeDistributionChart = ({
  themeDistribution = {},
  themes = [],
  totalPapers = 0,
}) => {
  const maxCount = Math.max(...Object.values(themeDistribution), 1);

  const themeColors = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
  ];

  const themeBgColors = [
    "bg-blue-50",
    "bg-emerald-50",
    "bg-purple-50",
    "bg-orange-50",
  ];

  const themeTextColors = [
    "text-blue-800",
    "text-emerald-800",
    "text-purple-800",
    "text-orange-800",
  ];

  const getPercentage = (count) => {
    if (!totalPapers || totalPapers === 0) return 0;
    return Math.round((count / totalPapers) * 100);
  };

  const getBarWidth = (count) => {
    if (!maxCount || maxCount === 0) return 0;
    return Math.round((count / maxCount) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Papers by Theme</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <svg
            className="w-6 h-6 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {themes.map((theme, index) => {
          const count = themeDistribution[theme] || 0;
          const colorIndex = index % themeColors.length;

          return (
            <div
              key={theme}
              className={`p-4 ${themeBgColors[colorIndex]} rounded-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4
                    className={`font-semibold ${themeTextColors[colorIndex]} text-sm md:text-base`}
                    title={theme}
                  >
                    {theme}
                  </h4>
                  <p className="text-sm text-gray-600">{count} papers</p>
                </div>
                <div className="text-right ml-4">
                  <p
                    className={`text-lg font-bold ${themeTextColors[colorIndex]}`}
                  >
                    {getPercentage(count)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${themeColors[colorIndex]} transition-all duration-500 ease-out`}
                  style={{ width: `${getBarWidth(count)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Papers</p>
            <p className="text-xl font-bold text-gray-900">{totalPapers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Active Themes</p>
            <p className="text-xl font-bold text-gray-900">
              {
                themes.filter((theme) => (themeDistribution[theme] || 0) > 0)
                  .length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDistributionChart;
