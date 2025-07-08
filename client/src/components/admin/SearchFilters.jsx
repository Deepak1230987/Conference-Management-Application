import React from "react";

/**
 * Search and filter component for admin pages
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.filter - Current status filter
 * @param {Function} props.setFilter - Function to update status filter
 * @param {string} props.themeFilter - Current theme filter
 * @param {Function} props.setThemeFilter - Function to update theme filter
 * @param {string} props.modeOfPresentationFilter - Current mode of presentation filter
 * @param {Function} props.setModeOfPresentationFilter - Function to update mode of presentation filter
 * @param {Array} props.themes - Array of available themes
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {boolean} props.showOnlySearch - Whether to show only search input (true for users tab, false for papers tab)
 */
const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  themeFilter,
  setThemeFilter,
  modeOfPresentationFilter,
  setModeOfPresentationFilter,
  themes,
  placeholder,
  showOnlySearch = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {showOnlySearch ? "Search" : "Search & Filters"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {showOnlySearch
            ? "Search through the data"
            : "Find and filter data using the options below"}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={placeholder || "Search..."}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters - Only show if not showOnlySearch */}
          {!showOnlySearch && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="min-w-0 sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="w-full py-3 px-4 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="review_awaited">Review Awaited</option>
                    <option value="review_in_progress">
                      Review in Progress
                    </option>
                    <option value="author_response_awaited">
                      Author Response Awaited
                    </option>
                    <option value="abstract_accepted">Abstract Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Theme Filter */}
              <div className="min-w-0 sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="relative">
                  <select
                    className="w-full py-3 px-4 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none"
                    value={themeFilter}
                    onChange={(e) => setThemeFilter(e.target.value)}
                  >
                    <option value="all">All Themes</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mode of Presentation Filter */}
              {modeOfPresentationFilter !== undefined &&
                setModeOfPresentationFilter && (
                  <div className="min-w-0 sm:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode of Presentation
                    </label>
                    <div className="relative">
                      <select
                        className="w-full py-3 px-4 pr-8 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none"
                        value={modeOfPresentationFilter}
                        onChange={(e) =>
                          setModeOfPresentationFilter(e.target.value)
                        }
                      >
                        <option value="all">All Modes</option>
                        <option value="Oral">Oral</option>
                        <option value="Poster (Only for Students)">
                          Poster (Students)
                        </option>
                        <option value="Video (Only for Students)">
                          Video (Students)
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchQuery ||
          (!showOnlySearch &&
            (filter !== "all" ||
              themeFilter !== "all" ||
              (modeOfPresentationFilter &&
                modeOfPresentationFilter !== "all")))) && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Active filters:
              </span>

              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {!showOnlySearch && filter !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Status: {filter}
                  <button
                    onClick={() => setFilter("all")}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {!showOnlySearch && themeFilter !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Theme: {themeFilter}
                  <button
                    onClick={() => setThemeFilter("all")}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {!showOnlySearch &&
                modeOfPresentationFilter &&
                modeOfPresentationFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    Mode: {modeOfPresentationFilter}
                    <button
                      onClick={() => setModeOfPresentationFilter("all")}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}

              <button
                onClick={() => {
                  setSearchQuery("");
                  if (!showOnlySearch) {
                    setFilter("all");
                    setThemeFilter("all");
                    if (setModeOfPresentationFilter)
                      setModeOfPresentationFilter("all");
                  }
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 transition-colors"
              >
                {showOnlySearch ? "Clear search" : "Clear all"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
