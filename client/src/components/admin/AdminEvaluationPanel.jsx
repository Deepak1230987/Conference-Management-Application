import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminEvaluationPanel = ({ paper }) => {
  const [marks, setMarks] = useState(null);
  const [confidentialComments, setConfidentialComments] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  // Load existing evaluation data
  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const response = await fetch(
          `/ictacem2025/api/admin/papers/${paper._id}/evaluation`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const evaluationData = data.evaluation;
            setEvaluation(evaluationData);
            setMarks(evaluationData.marks);
            setConfidentialComments(evaluationData.confidentialComments || "");
          }
        }
      } catch (error) {
        console.error("Error loading evaluation:", error);
      }
    };

    loadEvaluation();
  }, [paper._id]);

  // Handle saving evaluation
  const handleSaveEvaluation = async () => {
    if (marks !== null && (marks < 0 || marks > 100)) {
      setError("Marks must be between 0 and 100");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `/api/admin/papers/${paper._id}/evaluate`,
        {
          marks: marks === "" ? null : Number(marks),
          confidentialComments,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEvaluation({
          marks: marks === "" ? null : Number(marks),
          confidentialComments,
          reviewedBy: response.data.paper.adminEvaluation.reviewedBy,
          reviewedAt: response.data.paper.adminEvaluation.reviewedAt,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving evaluation:", error);
      setError("Failed to save evaluation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setMarks(evaluation?.marks || null);
    setConfidentialComments(evaluation?.confidentialComments || "");
    setIsEditing(false);
    setError(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not reviewed";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get marks color
  const getMarksColor = (marks) => {
    if (marks === null || marks === undefined) return "text-gray-500";
    if (marks >= 80) return "text-green-600";
    if (marks >= 60) return "text-yellow-600";
    if (marks >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Get marks background color
  const getMarksBgColor = (marks) => {
    if (marks === null || marks === undefined) return "bg-gray-100";
    if (marks >= 80) return "bg-green-100";
    if (marks >= 60) return "bg-yellow-100";
    if (marks >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Display Mode */}
      {!isEditing ? (
        <div className="space-y-4">
          {/* Marks Display */}
          <div className="flex items-center justify-between p-3 bg-white rounded-md border border-amber-200">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-amber-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Paper Score:
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${getMarksBgColor(
                evaluation?.marks
              )} ${getMarksColor(evaluation?.marks)}`}
            >
              {evaluation?.marks !== null && evaluation?.marks !== undefined
                ? `${evaluation.marks}/100`
                : "Not scored"}
            </div>
          </div>

          {/* Confidential Comments Display */}
          <div className="p-3 bg-white rounded-md border border-amber-200">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-amber-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Confidential Comments:
              </span>
            </div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap min-h-[60px] p-2 bg-gray-50 rounded border">
              {evaluation?.confidentialComments ||
                "No confidential comments added"}
            </div>
          </div>

          {/* Review Info */}
          {evaluation?.reviewedBy && (
            <div className="text-xs text-gray-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Reviewed by {evaluation.reviewedBy.username} on{" "}
              {formatDate(evaluation.reviewedAt)}
            </div>
          )}

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {evaluation?.marks !== null || evaluation?.confidentialComments
              ? "Edit Evaluation"
              : "Add Evaluation"}
          </button>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-4">
          {/* Marks Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={marks === null ? "" : marks}
              onChange={(e) =>
                setMarks(e.target.value === "" ? null : e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm"
              placeholder="Enter score (0-100)"
            />
          </div>

          {/* Confidential Comments Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidential Comments
            </label>
            <textarea
              rows="4"
              value={confidentialComments}
              onChange={(e) => setConfidentialComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm resize-none"
              placeholder="Add internal notes and observations (visible only to admins)..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveEvaluation}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Evaluation
                </>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvaluationPanel;
