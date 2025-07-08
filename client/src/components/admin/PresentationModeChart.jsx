import React from "react";

/**
 * Enhanced presentation mode distribution chart
 * @param {Object} props - Component props
 * @param {Object} props.presentationModes - Presentation mode distribution data
 * @param {number} props.totalPapers - Total number of papers
 */
const PresentationModeChart = ({ presentationModes = {}, totalPapers = 0 }) => {
  const modes = [
    {
      name: "Oral",
      count: presentationModes["Oral"] || 0,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Poster (Students)",
      count: presentationModes["Poster (Only for Students)"] || 0,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Video (Students)",
      count: presentationModes["Video (Only for Students)"] || 0,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2h8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const getPercentage = (count) => {
    if (!totalPapers || totalPapers === 0) return 0;
    return Math.round((count / totalPapers) * 100);
  };

  const getBarWidth = (count) => {
    if (!totalPapers || totalPapers === 0) return 0;
    return Math.round((count / totalPapers) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Presentation Modes
        </h3>
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

      <div className="space-y-6">
        {modes.map((mode, index) => (
          <div key={index} className={`p-4 ${mode.bgColor} rounded-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 bg-gradient-to-r ${mode.color} text-white rounded-lg`}
                >
                  {mode.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${mode.textColor}`}>
                    {mode.name}
                  </h4>
                  <p className="text-sm text-gray-600">{mode.count} papers</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${mode.textColor}`}>
                  {getPercentage(mode.count)}%
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${mode.color} transition-all duration-500 ease-out`}
                style={{ width: `${getBarWidth(mode.count)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Total Papers
          </span>
          <span className="text-lg font-bold text-gray-900">{totalPapers}</span>
        </div>
      </div>
    </div>
  );
};

export default PresentationModeChart;
