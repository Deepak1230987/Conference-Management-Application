import React from "react";

const AdminSidebar = ({ currentTab, setCurrentTab, onClose }) => {
  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a1 1 0 01-1 1H9a1 1 0 01-1-1V5z"
          />
        </svg>
      ),
      description: "Overview & Analytics",
    },
    {
      id: "users",
      name: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      description: "User Management",
    },
    {
      id: "papers",
      name: "Papers",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      description: "Paper Management",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-500">ICTACEM 2025</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
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

      {/* Navigation - Scrollable if needed */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out border ${
                currentTab === item.id
                  ? "bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 shadow-sm transform scale-[1.02]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent hover:border-gray-200"
              }`}
            >
              <div
                className={`flex-shrink-0 transition-colors duration-300 ${
                  currentTab === item.id ? "text-sky-600" : "text-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium transition-colors duration-300 ${
                    currentTab === item.id ? "text-sky-700" : "text-gray-900"
                  }`}
                >
                  {item.name}
                </div>
                <div
                  className={`text-xs transition-colors duration-300 ${
                    currentTab === item.id ? "text-sky-600" : "text-gray-500"
                  }`}
                >
                  {item.description}
                </div>
              </div>
              <div className="w-2 h-2 flex-shrink-0">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTab === item.id
                      ? "bg-sky-500 opacity-100 scale-100"
                      : "bg-gray-300 opacity-0 scale-50"
                  }`}
                ></div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
