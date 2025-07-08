import React from "react";
import SearchFilters from "./SearchFilters";
import UserCard from "./UserCard";

const UsersContent = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  themeFilter,
  setThemeFilter,
  themes,
  filteredUsers,
  fetchUserPapers,
  papers,
  expandedUser,
  filterPapers,
  reviewText,
  setReviewText,
  activePaper,
  setActivePaper,
  updatePaperStatus,
  downloadPaper,
  setError,
  updatePaperInUserState,
  toggleSubmission,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      {/* Users Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage conference participants and their submissions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              users found
            </div>
          </div>
        </div>
      </div>

      {/* Users Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            themeFilter={themeFilter}
            setThemeFilter={setThemeFilter}
            themes={themes}
            placeholder="Search users by name, email, or ID..."
            showOnlySearch={true}
          />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <svg
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search query or filters."
                  : "No users have registered yet."}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                fetchUserPapers={fetchUserPapers}
                papers={papers}
                expandedUser={expandedUser}
                filterPapers={filterPapers}
                reviewText={reviewText}
                setReviewText={setReviewText}
                activePaper={activePaper}
                setActivePaper={setActivePaper}
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
                    localReviewText,
                    updatePaperInUserState
                  )
                }
                downloadPaper={(paperId) => downloadPaper(paperId, setError)}
                setError={setError}
                updatePaperInUserState={updatePaperInUserState}
                onToggleSubmission={toggleSubmission}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersContent;
