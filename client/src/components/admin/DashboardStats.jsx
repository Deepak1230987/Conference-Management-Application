import React from "react";

/**
 * Dashboard statistics component showing key metrics
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 */
const DashboardStats = ({ stats }) => {
  console.log("DashboardStats stats:", stats);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold opacity-80">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers || 0}</p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Registered users
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold opacity-80">Review Awaited</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.review_awaited || 0}
            </p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Awaiting review
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold opacity-80">In Progress</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.review_in_progress || 0}
            </p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Review in progress
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold opacity-80">
              Author Response
            </h3>
            <p className="text-3xl font-bold mt-2">
              {stats.author_response_awaited || 0}
            </p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Awaiting author response
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold opacity-80">Accepted</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.abstract_accepted || 0}
            </p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Abstract accepted
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold opacity-80">Declined</h3>
            <p className="text-3xl font-bold mt-2">{stats.declined || 0}</p>
          </div>
          <div className="p-3 bg-white bg-opacity-30 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-white text-opacity-80">
            Declined papers
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
