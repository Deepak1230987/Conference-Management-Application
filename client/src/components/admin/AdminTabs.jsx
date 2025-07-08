import React from "react";

/**
 * Navigation tabs component for admin dashboard
 * @param {Object} props - Component props
 * @param {string} props.currentTab - Currently active tab
 * @param {Function} props.setCurrentTab - Function to change the active tab
 */
const AdminTabs = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setCurrentTab("users")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            currentTab === "users"
              ? "border-sky-500 text-sky-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setCurrentTab("papers")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            currentTab === "papers"
              ? "border-sky-500 text-sky-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Papers
        </button>
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            currentTab === "dashboard"
              ? "border-sky-500 text-sky-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Dashboard
        </button>
      </nav>
    </div>
  );
};

export default AdminTabs;
