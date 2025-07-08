import React, { useState, useMemo } from "react";

const PaymentStatusTable = ({ users, papers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'paid', 'unpaid'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Combine user and paper data for payment status
  const paymentData = useMemo(() => {
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
          paymentId: null,
          paymentStatus: "N/A",
          isPaid: false,
          submittedAt: user.createdAt,
        });
      } else {
        userPapers.forEach((paper) => {
          data.push({
            userId: user._id,
            userName: user.username,
            userEmail: user.email,
            customUserId: user.customUserId,
            paperId: paper._id,
            paperTitle: paper.title,
            paymentId: paper.paymentId,
            paymentStatus:
              paper.paymentId && paper.paymentId.trim() !== ""
                ? "Paid"
                : "Unpaid",
            isPaid: paper.paymentId && paper.paymentId.trim() !== "",
            submittedAt: paper.submittedAt || paper.createdAt,
          });
        });
      }
    });

    return data;
  }, [users, papers]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return paymentData.filter((item) => {
      const matchesSearch =
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.paperTitle &&
          item.paperTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "paid" && item.isPaid) ||
        (statusFilter === "unpaid" &&
          !item.isPaid &&
          item.paymentStatus !== "N/A");

      return matchesSearch && matchesStatus;
    });
  }, [paymentData, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEntries = paymentData.filter(
      (item) => item.paymentStatus !== "N/A"
    ).length;
    const paidEntries = paymentData.filter((item) => item.isPaid).length;
    const unpaidEntries = paymentData.filter(
      (item) => !item.isPaid && item.paymentStatus !== "N/A"
    ).length;
    const noSubmissions = paymentData.filter(
      (item) => item.paymentStatus === "N/A"
    ).length;

    return {
      total: totalEntries,
      paid: paidEntries,
      unpaid: unpaidEntries,
      noSubmissions,
      paymentRate:
        totalEntries > 0 ? ((paidEntries / totalEntries) * 100).toFixed(1) : 0,
    };
  }, [paymentData]);

  const getStatusBadge = (status, isPaid) => {
    if (status === "N/A") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Submission
        </span>
      );
    }

    if (isPaid) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Paid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Unpaid
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Payment Status Overview
        </h3>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total Submissions</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
            <div className="text-sm text-green-600">Paid</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.unpaid}
            </div>
            <div className="text-sm text-red-600">Unpaid</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.noSubmissions}
            </div>
            <div className="text-sm text-gray-600">No Submissions</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.paymentRate}%
            </div>
            <div className="text-sm text-purple-600">Payment Rate</div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4">
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
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid Only</option>
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
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      No payment records found
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
                  
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.paymentStatus, item.isPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.paymentId || "-"}
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
      {filteredData.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          {/* Results Summary */}
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              results
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

      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total {paymentData.length} payment records
        </div>
      )}
    </div>
  );
};

export default PaymentStatusTable;
