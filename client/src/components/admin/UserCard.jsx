import React, { useEffect, useState } from "react";
import PaperCard from "./PaperCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * User card component for displaying individual users in the admin dashboard
 * @param {Object} props - Component props
 * @param {Object} props.user - User data object
 * @param {Function} props.fetchUserPapers - Function to fetch papers for a user
 * @param {Object} props.papers - Object containing papers for each user
 * @param {string|null} props.expandedUser - ID of the currently expanded user
 * @param {Function} props.filterPapers - Function to filter papers by status and theme
 * @param {string} props.reviewText - Current review text
 * @param {Function} props.setReviewText - Function to update review text
 * @param {string|null} props.activePaper - ID of the currently active paper
 * @param {Function} props.setActivePaper - Function to set the active paper
 * @param {Function} props.updatePaperStatus - Function to update paper status
 * @param {Function} props.downloadPaper - Function to download paper
 * @param {Function} props.setError - Function to set error state
 * @param {Function} props.updatePaperInUserState - Function to update paper state in user context
 * @param {Function} props.onToggleSubmission - Function to handle toggle submission
 */
const UserCard = ({ user, fetchUserPapers, papers, setError }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [paperCount, setPaperCount] = useState(null);
  const [paperStatus, setPaperStatus] = useState({
    review_awaited: 0,
    review_in_progress: 0,
    author_response_awaited: 0,
    abstract_accepted: 0,
    declined: 0,
  });

  // Fetch paper count for this user when component mounts
  useEffect(() => {
    const fetchPaperCount = async () => {
      try {
        const response = await axios.get(
          `/api/admin/users/${user._id}/papers/count`
        );
        setPaperCount(response.data.count);
        setPaperStatus({
          review_awaited: response.data.review_awaited || 0,
          review_in_progress: response.data.review_in_progress || 0,
          author_response_awaited: response.data.author_response_awaited || 0,
          abstract_accepted: response.data.abstract_accepted || 0,
          declined: response.data.declined || 0,
        });
      } catch (err) {
        console.error("Error fetching paper count:", err);
        setPaperCount(0);
      }
    };

    fetchPaperCount();
  }, [user._id]);

  // If papers are already loaded, update the counts
  useEffect(() => {
    if (papers && papers[user._id]) {
      setPaperCount(papers[user._id].length);

      const counts = {
        review_awaited: 0,
        review_in_progress: 0,
        author_response_awaited: 0,
        abstract_accepted: 0,
        declined: 0,
      };

      papers[user._id].forEach((paper) => {
        if (
          paper.status &&
          Object.prototype.hasOwnProperty.call(counts, paper.status)
        ) {
          counts[paper.status] += 1;
        }
      });

      setPaperStatus(counts);
    }
  }, [papers, user._id]);

  // Format date nicely
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleToggleExpansion = async () => {
    try {
      if (!isExpanded) {
        // Only fetch papers when expanding
        await fetchUserPapers(user._id);
      }
      setIsExpanded((prev) => !prev);
    } catch (error) {
      console.error("Error toggling expansion:", error);
      setError && setError({ type: "error", message: "Failed to load papers" });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      {/* User Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.username}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-blue-600 font-mono">
                {user.customUserId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/admin/user/${user._id}`)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Registration date */}
          <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-500 font-medium">REGISTERED</p>
            <p className="text-sm text-gray-700 font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* User ID */}
          <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">USER ID</p>
            <p className="text-sm text-gray-700 font-medium">
              {user.customUserId}
            </p>
          </div>

          {/* Paper stats */}
          <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100">
            <p className="text-xs text-green-500 font-medium">PAPERS</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 font-medium">
                {paperCount !== null ? paperCount : "..."}
              </span>
              {paperCount > 0 && (
                <div className="flex space-x-1">
                  {paperStatus.review_awaited > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {paperStatus.review_awaited}
                    </span>
                  )}
                  {paperStatus.review_in_progress > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {paperStatus.review_in_progress}
                    </span>
                  )}
                  {paperStatus.author_response_awaited > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {paperStatus.author_response_awaited}
                    </span>
                  )}
                  {paperStatus.abstract_accepted > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {paperStatus.abstract_accepted}
                    </span>
                  )}
                  {paperStatus.declined > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {paperStatus.declined}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Papers Section
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6">
            <h4 className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Submitted Papers
            </h4>
            {!papers || !papers[user._id] ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
                <span className="ml-3 text-gray-600">Loading papers...</span>
              </div>
            ) : papers[user._id].length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No papers submitted
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This user has not submitted any papers yet.
                </p>
              </div>
            ) : (
              (() => {
                try {
                  const filteredPapers = filterPapers
                    ? filterPapers(papers[user._id])
                    : papers[user._id];

                  if (filteredPapers.length === 0) {
                    return (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No matching papers
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          No papers match your current filter criteria.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {filteredPapers.map((paper) => {
                        try {
                          return (
                            <PaperCard
                              key={paper._id}
                              paper={paper}
                              updatePaperStatus={(
                                paperId,
                                status,
                                errorSetter,
                                localReviewText
                              ) =>
                                updatePaperStatus(
                                  paperId,
                                  status,
                                  setError,
                                  localReviewText
                                )
                              }
                              activePaper={activePaper}
                              setActivePaper={setActivePaper}
                              reviewText={reviewText}
                              setReviewText={setReviewText}
                              setError={setError}
                              updatePaperInUserState={updatePaperInUserState}
                              onToggleSubmission={onToggleSubmission}
                            />
                          );
                        } catch (paperError) {
                          console.error(
                            "Error rendering paper:",
                            paperError,
                            paper
                          );
                          return (
                            <div
                              key={paper._id || `error-${Math.random()}`}
                              className="bg-red-50 border border-red-200 rounded-lg p-4"
                            >
                              <p className="text-red-600 font-medium">
                                Error loading paper: {paper.title || "Unknown"}
                              </p>
                              <p className="text-red-500 text-sm">
                                Please check the console for details.
                              </p>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                } catch (filterError) {
                  console.error("Error filtering papers:", filterError);
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 font-medium">
                        Error loading papers
                      </p>
                      <p className="text-red-500 text-sm">
                        There was an issue displaying the papers. Please refresh
                        the page.
                      </p>
                    </div>
                  );
                }
              })()
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserCard;
