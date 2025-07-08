import React from "react";
import SearchFilters from "./SearchFilters";
import PaperCard from "./PaperCard";

const PapersContent = ({
  paperSearchQuery,
  setPaperSearchQuery,
  filter,
  setFilter,
  themeFilter,
  setThemeFilter,
  modeOfPresentationFilter,
  setModeOfPresentationFilter,
  themes,
  filteredAllPapers,
  activePaper,
  setActivePaper,
  setError,
  toggleSubmission,
  fetchAllPapers,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      {/* Papers Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Paper Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and manage all paper submissions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                {filteredAllPapers.length}
              </span>{" "}
              papers found
            </div>
            {(filter !== "all" ||
              themeFilter !== "all" ||
              modeOfPresentationFilter !== "all") && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500">Filters:</span>
                {filter !== "all" && (
                  <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full">
                    {filter}
                  </span>
                )}
                {themeFilter !== "all" && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {themeFilter}
                  </span>
                )}
                {modeOfPresentationFilter !== "all" && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {modeOfPresentationFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Papers Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilters
            searchQuery={paperSearchQuery}
            setSearchQuery={setPaperSearchQuery}
            filter={filter}
            setFilter={setFilter}
            themeFilter={themeFilter}
            setThemeFilter={setThemeFilter}
            modeOfPresentationFilter={modeOfPresentationFilter}
            setModeOfPresentationFilter={setModeOfPresentationFilter}
            themes={themes}
            placeholder="Search papers by title, author, or ID..."
            showOnlySearch={false}
          />
        </div>

        {/* Papers List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            {filteredAllPapers.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No papers found
                </h3>
                <p className="text-gray-500">
                  {paperSearchQuery ||
                  filter !== "all" ||
                  themeFilter !== "all" ||
                  modeOfPresentationFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No papers have been submitted yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAllPapers.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    downloadPaper={(paperId) => {
                      // Open PDF in a new browser tab instead of downloading
                      window.open(
                        `/ictacem2025/api/papers/view/${paperId}`,
                        "_blank"
                      );
                    }}
                    activePaper={activePaper}
                    setActivePaper={setActivePaper}
                    setError={setError}
                    onToggleSubmission={toggleSubmission}
                    onPaperUpdate={() => {
                      // Update the paper in the allPapers state immediately
                      // This provides instant UI feedback
                      fetchAllPapers();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapersContent;
