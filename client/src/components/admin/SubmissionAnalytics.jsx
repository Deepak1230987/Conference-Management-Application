import React from "react";

/**
 * Submission analytics component showing detailed submission statistics
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {number} props.totalPapers - Total number of papers
 */
const SubmissionAnalytics = ({ stats, totalPapers = 0 }) => {
  // Helper function to calculate percentage
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Submission type data - Updated labels and logic
  const submissionTypes = [
    {
      type: "Abstract Only",
      count: stats.abstractOnlySubmitted || 0,
      icon: "📄",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      description: "Papers with only abstract submitted",
    },
    {
      type: "With Full Paper",
      count: stats.fullPaperSubmitted || 0,
      icon: "📋",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      description: "Papers with full paper submitted",
    },
  ];

  // Payment status data
  const paymentData = [
    {
      status: "Paid",
      count: stats.paymentCompleted || 0,
      icon: "✅",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-800",
    },
    {
      status: "Unpaid",
      count: stats.pendingPayment || 0,
      icon: "⏳",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Submission Analytics
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

      {/* Submission Types */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Submission Types
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissionTypes.map((type, index) => (
            <div key={index} className={`${type.bgColor} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h5 className={`font-semibold ${type.textColor}`}>
                      {type.type}
                    </h5>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${type.textColor}`}>
                    {getPercentage(type.count, totalPapers)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${type.color} transition-all duration-500 ease-out`}
                  style={{
                    width: `${getPercentage(type.count, totalPapers)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Payment Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentData.map((payment, index) => (
            <div key={index} className={`${payment.bgColor} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{payment.icon}</span>
                  <div>
                    <h5 className={`font-semibold ${payment.textColor}`}>
                      {payment.status}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {payment.count} submissions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${payment.textColor}`}>
                    {getPercentage(payment.count, totalPapers)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${payment.color} transition-all duration-500 ease-out`}
                  style={{
                    width: `${getPercentage(payment.count, totalPapers)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900">{totalPapers}</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Payment Rate</p>
          <p className="text-2xl font-bold text-gray-900">
            {getPercentage(stats.paymentCompleted || 0, totalPapers)}%
          </p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">With Full Paper</p>
          <p className="text-2xl font-bold text-gray-900">
            {getPercentage(stats.fullPaperSubmitted || 0, totalPapers)}%
          </p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Abstract Only</p>
          <p className="text-2xl font-bold text-gray-900">
            {getPercentage(stats.abstractOnlySubmitted || 0, totalPapers)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionAnalytics;
