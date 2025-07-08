import React from "react";

/**
 * Evaluation metrics component showing detailed evaluation statistics
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {number} props.totalPapers - Total number of papers
 */
const EvaluationMetrics = ({ stats, totalPapers = 0 }) => {
  // Helper function to calculate percentage
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Helper function to get evaluation completion rate
  const getEvaluationCompletionRate = () => {
    const evaluatedPapers =
      (stats.abstract_accepted || 0) + (stats.declined || 0);
    return getPercentage(evaluatedPapers, totalPapers);
  };

  // Helper function to get acceptance rate
  const getAcceptanceRate = () => {
    const evaluatedPapers =
      (stats.abstract_accepted || 0) + (stats.declined || 0);
    if (evaluatedPapers === 0) return 0;
    return getPercentage(stats.abstract_accepted || 0, evaluatedPapers);
  };

  const evaluationData = [
    {
      title: "Evaluation Progress",
      value: `${getEvaluationCompletionRate()}%`,
      description: `${
        (stats.abstract_accepted || 0) + (stats.declined || 0)
      } of ${totalPapers} papers`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-100",
    },
    {
      title: "Acceptance Rate",
      value: `${getAcceptanceRate()}%`,
      description: "Of evaluated papers",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-100",
    },
    {
      title: "Pending Review",
      value: stats.review_awaited || 0,
      description: "Papers awaiting review",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      textColor: "text-amber-100",
    },
    {
      title: "In Review",
      value: stats.review_in_progress || 0,
      description: "Currently being reviewed",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      textColor: "text-blue-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Evaluation Metrics
        </h3>
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluationData.map((metric, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${metric.bgColor} rounded-xl shadow-md p-4 text-white transform hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${metric.iconBg} bg-opacity-20 rounded-lg`}>
                {metric.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">{metric.title}</h4>
              <p className={`text-xs ${metric.textColor}`}>
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        {/* Evaluation Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Evaluation Progress
            </span>
            <span className="text-sm text-gray-500">
              {getEvaluationCompletionRate()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${getEvaluationCompletionRate()}%` }}
            />
          </div>
        </div>

        {/* Acceptance Rate Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Acceptance Rate
            </span>
            <span className="text-sm text-gray-500">
              {getAcceptanceRate()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${getAcceptanceRate()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationMetrics;
