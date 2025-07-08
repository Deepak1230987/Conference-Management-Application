import React from "react";

/**
 * Paper status distribution chart component for the admin dashboard
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 */
const StatusDistributionChart = ({ stats }) => {
  const statusData = [
    {
      name: "Review Awaited",
      count: stats.review_awaited || 0,
      color: "bg-blue-500",
    },
    {
      name: "Review in Progress",
      count: stats.review_in_progress || 0,
      color: "bg-yellow-500",
    },
    {
      name: "Author Response Awaited",
      count: stats.author_response_awaited || 0,
      color: "bg-purple-500",
    },
    {
      name: "Abstract Accepted",
      count: stats.abstract_accepted || 0,
      color: "bg-green-500",
    },
    { name: "Declined", count: stats.declined || 0, color: "bg-red-500" },
  ];

  const total =
    (stats.review_awaited || 0) +
    (stats.review_in_progress || 0) +
    (stats.author_response_awaited || 0) +
    (stats.abstract_accepted || 0) +
    (stats.declined || 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Review Status Distribution
      </h2>
      <div className="relative h-44 flex items-center justify-center">
        {/* Circle chart with different colored segments */}
        <div className="h-36 w-36 rounded-full overflow-hidden flex flex-col">
          {statusData.map((status, index) => (
            <div
              key={index}
              className={`${status.color}`}
              style={{
                height: total > 0 ? `${(status.count / total) * 100}%` : "0%",
              }}
            ></div>
          ))}
        </div>

        {/* Total in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center shadow-md">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-500">Total Papers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {statusData.map((status, index) => (
          <div key={index} className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${status.color}`}></div>
            <span className="text-sm text-gray-600">
              {status.name}: {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistributionChart;
