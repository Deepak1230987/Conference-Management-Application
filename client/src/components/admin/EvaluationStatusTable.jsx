import React, { useState, useMemo } from "react";

const EvaluationStatusTable = ({ users, papers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'evaluated', 'pending'
  const [sortBy, setSortBy] = useState("submittedAt"); // 'submittedAt', 'marks', 'userName'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Combine user and paper data for evaluation status
  const evaluationData = useMemo(() => {
    const data = [];

    users.forEach((user) => {
      const userPapers = papers.filter(
        (paper) => paper.user?._id === user._id || paper.user === user._id
      );

      if (userPapers.length === 0) {
        // User with no papers
        data.push({
          userId: user._id,
          userName: user.username,
          userEmail: user.email,
          customUserId: user.customUserId,
          paperId: null,
          paperTitle: "No papers submitted",
          marks: null,
          confidentialComments: "",
          reviewedBy: null,
          reviewedAt: null,
          evaluationStatus: "N/A",
          isEvaluated: false,
          submittedAt: user.createdAt,
          status: "N/A",
        });
      } else {
        userPapers.forEach((paper) => {
          const adminEval = paper.adminEvaluation || {};
          const hasMarks =
            adminEval.marks !== null && adminEval.marks !== undefined;

          data.push({
            userId: user._id,
            userName: user.username,
            userEmail: user.email,
            customUserId: user.customUserId,
            paperId: paper._id,
            paperTitle: paper.title,
            marks: adminEval.marks,
            confidentialComments: adminEval.confidentialComments || "",
            reviewedBy: adminEval.reviewedBy,
            reviewedAt: adminEval.reviewedAt,
            evaluationStatus: hasMarks ? "Evaluated" : "Pending",
            isEvaluated: hasMarks,
            submittedAt: paper.submittedAt || paper.createdAt,
            status: paper.status || "submitted",
            review: paper.review || "",
          });
        });
      }
    });

    return data;
  }, [users, papers]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = evaluationData.filter((item) => {
      const matchesSearch =
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.paperTitle &&
          item.paperTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "evaluated" && item.isEvaluated) ||
        (statusFilter === "pending" &&
          !item.isEvaluated &&
          item.evaluationStatus !== "N/A");

      return matchesSearch && matchesStatus;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "marks":
          if (a.marks === null && b.marks === null) return 0;
          if (a.marks === null) return 1;
          if (b.marks === null) return -1;
          return b.marks - a.marks;
        case "userName":
          return a.userName.localeCompare(b.userName);
        case "submittedAt":
        default:
          return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
    });

    return filtered;
  }, [evaluationData, searchQuery, statusFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSubmissions = evaluationData.filter(
      (item) => item.evaluationStatus !== "N/A"
    ).length;
    const evaluatedPapers = evaluationData.filter(
      (item) => item.isEvaluated
    ).length;
    const pendingPapers = evaluationData.filter(
      (item) => !item.isEvaluated && item.evaluationStatus !== "N/A"
    ).length;
    const noSubmissions = evaluationData.filter(
      (item) => item.evaluationStatus === "N/A"
    ).length;

    const evaluatedMarks = evaluationData
      .filter((item) => item.marks !== null)
      .map((item) => item.marks);
    const averageScore =
      evaluatedMarks.length > 0
        ? (
            evaluatedMarks.reduce((sum, mark) => sum + mark, 0) /
            evaluatedMarks.length
          ).toFixed(1)
        : 0;

    return {
      total: totalSubmissions,
      evaluated: evaluatedPapers,
      pending: pendingPapers,
      noSubmissions,
      evaluationRate:
        totalSubmissions > 0
          ? ((evaluatedPapers / totalSubmissions) * 100).toFixed(1)
          : 0,
      averageScore,
    };
  }, [evaluationData]);

  const getStatusBadge = (status, isEvaluated, marks) => {
    if (status === "N/A") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Submission
        </span>
      );
    }

    if (isEvaluated) {
      const bgColor =
        marks >= 70
          ? "bg-green-100"
          : marks >= 50
          ? "bg-yellow-100"
          : "bg-red-100";
      const textColor =
        marks >= 70
          ? "text-green-800"
          : marks >= 50
          ? "text-yellow-800"
          : "text-red-800";

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Evaluated ({marks}/100)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        Pending Review
      </span>
    );
  };

  const getScoreDisplay = (marks) => {
    if (marks === null || marks === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    const color =
      marks >= 70
        ? "text-green-600"
        : marks >= 50
        ? "text-yellow-600"
        : "text-red-600";
    return (
      <div className="flex items-center">
        <span className={`font-bold ${color}`}>{marks}</span>
        <span className="text-gray-400 text-sm ml-1">/100</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Evaluation Status Overview
        </h3>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total Submissions</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.evaluated}
            </div>
            <div className="text-sm text-green-600">Evaluated</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
            <div className="text-sm text-orange-600">Pending</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.noSubmissions}
            </div>
            <div className="text-sm text-gray-600">No Submissions</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.evaluationRate}%
            </div>
            <div className="text-sm text-purple-600">Evaluation Rate</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.averageScore}
            </div>
            <div className="text-sm text-indigo-600">Average Score</div>
          </div>
        </div>

        {/* Search, Filter, and Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user name, email, ID, or paper title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="evaluated">Evaluated Only</option>
            <option value="pending">Pending Only</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="submittedAt">Sort by Submission Date</option>
            <option value="marks">Sort by Score</option>
            <option value="userName">Sort by User Name</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paper
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evaluation Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      No evaluation records found
                    </p>
                    <p className="text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={`${item.userId}-${item.paperId || "no-paper"}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {item.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.userEmail}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {item.customUserId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-900 max-w-xs truncate"
                      title={item.paperTitle}
                    >
                      {item.paperTitle}
                    </div>

                    {item.status !== "N/A" && (
                      <div className="text-xs text-blue-600 capitalize">
                        {item.status}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(
                      item.evaluationStatus,
                      item.isEvaluated,
                      item.marks
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getScoreDisplay(item.marks)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reviewedAt
                      ? new Date(item.reviewedAt).toLocaleDateString('en-GB')
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.submittedAt
                      ? new Date(item.submittedAt).toLocaleDateString('en-GB')
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedData.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          {/* Results Summary */}
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
              {filteredAndSortedData.length} results
            </span>
            <div className="ml-4 flex items-center">
              <label className="mr-2">Per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {filteredAndSortedData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total {evaluationData.length} evaluation records
        </div>
      )}
    </div>
  );
};

export default EvaluationStatusTable;
