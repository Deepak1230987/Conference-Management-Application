import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminEvaluationPanel from "./AdminEvaluationPanel";
import AdminFileUpload from "./AdminFileUpload";

const PaperCard = ({
  paper,
  activePaper,
  setActivePaper,
  setError,
  onToggleSubmission,
  onPaperUpdate,
}) => {
  const navigate = useNavigate();
  const [localReviewText, setLocalReviewText] = useState(paper.review || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(paper.status);
  const [isToggling, setIsToggling] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  useEffect(() => {
    setLocalReviewText(paper.review || "");
    setSelectedStatus(paper.status);
  }, [paper]);

  const statusColors = {
    review_awaited: "bg-blue-100 text-blue-800 border border-blue-200",
    review_in_progress:
      "bg-yellow-100 text-yellow-800 border border-yellow-200",
    author_response_awaited:
      "bg-purple-100 text-purple-800 border border-purple-200",
    abstract_accepted:
      "bg-emerald-100 text-emerald-800 border border-emerald-200",
    declined: "bg-rose-100 text-rose-800 border border-rose-200",
  };

  const statusIndicatorColors = {
    review_awaited: "bg-blue-500",
    review_in_progress: "bg-yellow-500",
    author_response_awaited: "bg-purple-500",
    abstract_accepted: "bg-emerald-500",
    declined: "bg-rose-500",
  };

  const statusButtonColors = {
    review_awaited: "bg-blue-500 hover:bg-blue-600 text-white",
    review_in_progress: "bg-yellow-500 hover:bg-yellow-600 text-white",
    author_response_awaited: "bg-purple-500 hover:bg-purple-600 text-white",
    abstract_accepted: "bg-emerald-500 hover:bg-emerald-600 text-white",
    declined: "bg-rose-500 hover:bg-rose-600 text-white",
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const reviewData = {
        status: selectedStatus,
        review: localReviewText || "",
      };

      const response = await fetch(
        `/ictacem2025/api/admin/papers/${paper._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update paper status");
      }

      const updatedPaper = await response.json();

      if (onPaperUpdate && typeof onPaperUpdate === "function") {
        onPaperUpdate(updatedPaper);
      }

      setActivePaper(null);

      if (setError) {
        setError({
          type: "success",
          message: `Paper status updated to ${selectedStatus}${
            localReviewText ? " with review comments" : ""
          }`,
        });
      }
    } catch (error) {
      console.error("Failed to update paper:", error);
      if (setError) {
        setError({
          type: "error",
          message: `Failed to update paper status: ${error.message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid date";

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return dateObj.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleToggleSubmission = async (type, reset) => {
    try {
      setIsToggling(true);
      await onToggleSubmission(paper._id, type, reset);
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      setError &&
        setError({
          type: "error",
          message: `Failed to toggle ${type} submission`,
        });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteAdminFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `/api/admin/papers/${paper._id}/admin-files/${fileId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedPaper = {
          ...paper,
          adminUploadedFiles: (paper.adminUploadedFiles || []).filter(
            (file) => file._id !== fileId
          ),
        };

        if (onPaperUpdate && typeof onPaperUpdate === "function") {
          onPaperUpdate(updatedPaper);
        } else {
          window.location.reload();
        }

        setError &&
          setError({
            type: "success",
            message: "File deleted successfully.",
          });
      } else {
        throw new Error(response.data.message || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting admin file:", error);
      setError &&
        setError({
          type: "error",
          message:
            error.response?.data?.message ||
            "Failed to delete file. Please try again.",
        });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className={`h-2 ${statusIndicatorColors[paper.status]}`}></div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row  mr-10 gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <h3 className="text-xl font-semibold text-gray-800 leading-tight">
                  {paper.title}
                </h3>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    statusColors[paper.status]
                  }`}
                >
                  {paper.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6 shadow-inner">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    ICTACEM ID
                  </p>
                  <p className="font-medium text-gray-800 bg-white p-2 rounded border border-gray-200 shadow-sm">
                    {paper.ictacemId}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Theme
                  </p>
                  <p className="font-medium text-gray-800 bg-white p-2 rounded border border-gray-200 shadow-sm line-clamp-2">
                    {paper.theme}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Mode of Presentation
                  </p>
                  <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {paper.modeOfPresentation || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Payment ID
                  </p>
                  <p className="font-medium text-gray-800 bg-white p-2 rounded border border-gray-200 shadow-sm">
                    {paper.paymentId}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Submitted
                  </p>
                  <p className="font-medium text-gray-800 bg-white p-2 rounded border border-gray-200 shadow-sm">
                    {formatDate(paper.submittedAt)}
                  </p>
                </div>
              </div>

              {paper.review && activePaper !== paper._id && (
                <div className="p-5 bg-blue-50 rounded-lg mb-6 border border-blue-100 shadow-sm">
                  <h4 className="flex items-center text-sm font-semibold text-blue-700 mb-3">
                    Review Comments
                  </h4>
                  <div className="bg-white p-4 rounded-md border border-blue-100 text-sm whitespace-pre-wrap text-gray-700 shadow-sm">
                    {paper.review}
                  </div>
                </div>
              )}

              <div className="p-5 bg-amber-50 rounded-lg mb-6 border border-amber-200 shadow-sm">
                <h4 className="flex items-center text-sm font-semibold text-amber-700 mb-4">
                  Admin Evaluation (Confidential)
                </h4>

                <AdminEvaluationPanel paper={paper} />
              </div>

              <div>
                <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  Authors ({(paper.authors || []).length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(paper.authors || []).map((author, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
                          {getInitials(author.name)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {author.name}
                        </p>
                        {author.affiliation && (
                          <p className="text-sm text-gray-600 truncate">
                            {author.affiliation}
                          </p>
                        )}
                        {author.address && (
                          <p className="text-xs text-gray-500 truncate">
                            {author.address}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-72 mt-6 md:mt-0">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate(`/admin/paper/${paper._id}`)}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                  type="button"
                >
                  View Paper Details
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() => {
                    window.open(
                      `/ictacem2025/api/papers/view/${paper._id}`,
                      "_blank"
                    );
                  }}
                  className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                  type="button"
                >
                  View Abstract
                </button>

                {paper.fullPaperPdfPath && (
                  <button
                    onClick={() => {
                      window.open(
                        `/ictacem2025/api/papers/view-full/${paper._id}`,
                        "_blank"
                      );
                    }}
                    className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                    type="button"
                  >
                    View Full Paper
                  </button>
                )}
              </div>

              {activePaper === paper._id ? (
                <div className="border rounded-lg overflow-hidden bg-white shadow-md">
                  <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-indigo-900 flex items-center">
                        Review Paper
                      </h3>
                      <button
                        onClick={() => {
                          setActivePaper(null);
                          setLocalReviewText(paper.review || "");
                          setSelectedStatus(paper.status);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        type="button"
                        aria-label="Close review panel"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-5">
                      <label
                        htmlFor={`review-${paper._id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Review Comments
                      </label>
                      <textarea
                        id={`review-${paper._id}`}
                        rows="6"
                        className="w-full border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm resize-none"
                        placeholder="Add your detailed review comments for the author..."
                        value={localReviewText}
                        onChange={(e) => setLocalReviewText(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Set Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange("review_awaited")}
                          className={`flex-1 py-3 px-3 rounded-md text-sm font-medium transition-all ${
                            selectedStatus === "review_awaited"
                              ? "ring-2 ring-blue-500 " +
                                statusButtonColors.review_awaited
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            Review Awaited
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange("review_in_progress")
                          }
                          className={`flex-1 py-3 px-3 rounded-md text-sm font-medium transition-all ${
                            selectedStatus === "review_in_progress"
                              ? "ring-2 ring-yellow-500 " +
                                statusButtonColors.review_in_progress
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            Review in Progress
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange("author_response_awaited")
                          }
                          className={`flex-1 py-3 px-3 rounded-md text-sm font-medium transition-all ${
                            selectedStatus === "author_response_awaited"
                              ? "ring-2 ring-purple-500 " +
                                statusButtonColors.author_response_awaited
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            Author Response Awaited
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange("abstract_accepted")
                          }
                          className={`flex-1 py-3 px-3 rounded-md text-sm font-medium transition-all ${
                            selectedStatus === "abstract_accepted"
                              ? "ring-2 ring-emerald-500 " +
                                statusButtonColors.abstract_accepted
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            Abstract Accepted
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange("declined")}
                          className={`flex-1 py-3 px-3 rounded-md text-sm font-medium transition-all ${
                            selectedStatus === "declined"
                              ? "ring-2 ring-rose-500 " +
                                statusButtonColors.declined
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            Declined
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center shadow-sm
                        ${
                          isSubmitting
                            ? "bg-gray-400"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                        }
                      `}
                    >
                      {isSubmitting ? "Processing..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActivePaper(paper._id);
                    setLocalReviewText(paper.review || "");
                    setSelectedStatus(paper.status);
                  }}
                  className="w-full flex items-center justify-center mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                  type="button"
                >
                  {paper.review ? "Edit Review" : "Write Review"}
                </button>
              )}

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-xs uppercase tracking-wider text-yellow-700 font-semibold mb-3">
                  Reset Submissions
                </h4>

                <div className="flex items-center justify-between mb-3 p-2 bg-white rounded border">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      Abstract Submission
                    </span>
                    <p className="text-xs text-gray-500">
                      Reset to allow user to re-upload abstract
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSubmission("abstract", true)}
                    disabled={isToggling || !paper.pdfPath}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      !paper.pdfPath
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                    }`}
                  >
                    {isToggling ? "Resetting..." : "Reset Abstract"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      Full Paper Submission
                    </span>
                    <p className="text-xs text-gray-500">
                      Reset to allow user to re-upload full paper
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSubmission("fullpaper", true)}
                    disabled={isToggling || !paper.fullPaperPdfPath}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      !paper.fullPaperPdfPath
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                    }`}
                  >
                    {isToggling ? "Resetting..." : "Reset Full Paper"}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase tracking-wider text-green-700 font-semibold">
                    Admin Files
                  </h4>
                  <button
                    onClick={() => setShowFileUpload(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Upload File
                  </button>
                </div>

                {paper.adminUploadedFiles &&
                Array.isArray(paper.adminUploadedFiles) &&
                paper.adminUploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {paper.adminUploadedFiles.map((file, index) => (
                      <div
                        key={file._id || index}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {file.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="capitalize">
                              {file.fileType?.replace("_", " ")}
                            </span>
                            {file.description && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  {file.description}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              {file.visibleToUser
                                ? "Visible to user"
                                : "Admin only"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() =>
                              window.open(
                                `/ictacem2025/api/admin/papers/${paper._id}/admin-files/${file._id}/view`,
                                "_blank"
                              )
                            }
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteAdminFile(file._id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No admin files uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFileUpload && (
        <AdminFileUpload
          paperId={paper._id}
          onClose={() => setShowFileUpload(false)}
          onFileUploaded={(uploadedFileOrPaper) => {
            // Check if we received the full paper or just the file
            const updatedPaper = uploadedFileOrPaper._id
              ? uploadedFileOrPaper // It's the full paper
              : {
                  // It's just the file, construct the updated paper
                  ...paper,
                  adminUploadedFiles: [
                    ...(paper.adminUploadedFiles || []),
                    uploadedFileOrPaper,
                  ],
                };

            if (onPaperUpdate && typeof onPaperUpdate === "function") {
              onPaperUpdate(updatedPaper);
            }
            setShowFileUpload(false);
          }}
        />
      )}
    </>
  );
};

export default PaperCard;
