import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Eye,
  Clock,
  User,
  AlertTriangle,
  FileText,
  Upload,
} from "lucide-react";

const SubmissionHistoryModal = ({ isOpen, onClose, paperId, paperTitle }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/ictacem2025/api/admin/papers/${paperId}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submission history");
        }

        const data = await response.json();
        setHistory(data.paper);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && paperId) {
      fetchSubmissionHistory();
    }
  }, [isOpen, paperId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      current: {
        color: "bg-emerald-100/80 text-emerald-700 border-emerald-200/50",
        label: "Current",
        icon: "✓",
      },
      superseded: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200/50",
        label: "Superseded",
        icon: "⚠",
      },
      reset_by_admin: {
        color: "bg-rose-100/80 text-rose-700 border-rose-200/50",
        label: "Reset by Admin",
        icon: "⚡",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-slate-100/80 text-slate-700 border-slate-200/50",
      label: status,
      icon: "●",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color} backdrop-blur-sm`}
      >
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const handleView = (submissionId, type) => {
    const token = localStorage.getItem("token");
    const url = `/ictacem2025/api/admin/papers/${paperId}/history/${type}/${submissionId}/view?token=${token}`;
    window.open(url, "_blank");
  };

  const SubmissionCard = ({ submission, type }) => (
    <div className="group relative bg-white/60 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/80 hover:shadow-lg transition-all duration-300 shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {/* Type Icon */}
            <div
              className={`p-2 rounded-lg ${
                type === "abstract"
                  ? "bg-blue-100/80 text-blue-600"
                  : "bg-purple-100/80 text-purple-600"
              }`}
            >
              {type === "abstract" ? (
                <FileText size={16} />
              ) : (
                <Upload size={16} />
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 text-lg">
                {submission.adminAction ? (
                  <>
                    Admin Action
                    <span className="block text-sm font-normal text-gray-600 mt-1">
                      {submission.adminAction
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </>
                ) : (
                  <>
                    Version {submission.version}
                    <span className="block text-sm font-normal text-gray-600 mt-1">
                      {type === "abstract"
                        ? "Abstract Submission"
                        : "Full Paper Submission"}
                    </span>
                  </>
                )}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(submission.status)}

            <div className="flex space-x-1">
              <button
                onClick={() => handleView(submission._id, type)}
                className="p-2 text-blue-600 hover:bg-blue-100/80 rounded-lg transition-all duration-200 backdrop-blur-sm"
                title="View PDF"
              >
                <Eye size={16} />
                <span className="sr-only px-2">View PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {submission.adminAction ? (
            // Admin action entry
            <div className="bg-blue-50/60 backdrop-blur-sm border border-blue-200/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-700 mb-3">
                <User size={16} />
                <span className="font-semibold">Administrative Action</span>
              </div>
              <div className="space-y-2 text-blue-600">
                <div className="flex items-center space-x-2">
                  <Clock size={14} />
                  <span>Performed: {formatDate(submission.actionAt)}</span>
                </div>
                {submission.previousStatus && submission.newStatus && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status Change:</span>
                    <span className="bg-amber-100/80 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                      {submission.previousStatus}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="bg-emerald-100/80 text-emerald-800 px-2 py-1 rounded-md text-xs font-medium">
                      {submission.newStatus}
                    </span>
                  </div>
                )}
                {submission.reviewComments && (
                  <div className="mt-3">
                    <span className="font-medium block mb-2">
                      Review Comments:
                    </span>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200/30 text-gray-700">
                      {submission.reviewComments}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Regular submission entry
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock size={14} />
              <span>Submitted: {formatDate(submission.submittedAt)}</span>
              {submission.fileName && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{submission.fileName}</span>
                </>
              )}
            </div>
          )}

          {submission.status === "reset_by_admin" && submission.resetBy && (
            <div className="bg-rose-50/60 backdrop-blur-sm border border-rose-200/30 rounded-lg p-4 mt-3">
              <div className="flex items-center space-x-2 text-rose-700 mb-2">
                <AlertTriangle size={16} />
                <span className="font-semibold">Reset by Administrator</span>
              </div>
              <div className="space-y-2 text-rose-600">
                <div className="flex items-center space-x-2">
                  <User size={12} />
                  <span>
                    Reset by:{" "}
                    {submission.resetBy.username || submission.resetBy.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={12} />
                  <span>Reset at: {formatDate(submission.resetAt)}</span>
                </div>
                {submission.resetReason && (
                  <div className="mt-2">
                    <span className="font-medium block mb-1">Reason:</span>
                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded border border-rose-200/30 text-gray-700">
                      {submission.resetReason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50" />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100/80 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Submission History
              </h2>
              <p className="text-gray-600 mt-1 text-lg">{paperTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-white/30"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200/60 animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-blue-100/20 backdrop-blur-sm"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 text-rose-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {history && !loading && (
            <div className="space-y-6">
              {(() => {
                // Combine all history entries into a single timeline
                const allEntries = [];

                // Add abstract submissions
                if (history.abstractSubmissionHistory) {
                  history.abstractSubmissionHistory.forEach((submission) => {
                    allEntries.push({ ...submission, type: "abstract" });
                  });
                }

                // Add full paper submissions
                if (history.fullPaperSubmissionHistory) {
                  history.fullPaperSubmissionHistory.forEach((submission) => {
                    allEntries.push({ ...submission, type: "fullpaper" });
                  });
                }

                // Sort by date (most recent first)
                allEntries.sort((a, b) => {
                  const dateA = new Date(a.submittedAt || a.actionAt);
                  const dateB = new Date(b.submittedAt || b.actionAt);
                  return dateB - dateA;
                });

                if (allEntries.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        No submission history found for this paper.
                      </p>
                    </div>
                  );
                }

                return (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Complete Timeline
                      </h3>
                      <span className="px-3 py-1 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium backdrop-blur-sm">
                        {allEntries.length}{" "}
                        {allEntries.length === 1 ? "entry" : "entries"}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {allEntries.map((entry, index) => (
                        <SubmissionCard
                          key={entry._id || `${entry.type}-${index}`}
                          submission={entry}
                          type={entry.type}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistoryModal;
