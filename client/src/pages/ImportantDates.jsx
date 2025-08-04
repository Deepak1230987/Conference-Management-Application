import React from "react";

const ImportantDates = () => {
  const dates = [
    {
      date: "July 21, 2025",
      event: "Opening of Extended abstract submission for paper (Online)",
      icon: "📝",
    },
    {
      date: "September 15, 2025",
      event: "Deadline for Submission of Extended Abstract (online)",
      icon: "⏰",
    },
    {
      date: "September 30, 2025",
      event: "Extended Abstract Acceptance Notification",
      icon: "✉️",
    },
    {
      date: "October 31, 2025",
      event: "Deadline for Submission of Final Full Length Paper (online)",
      icon: "📄",
    },
    {
      date: "October 31, 2025",
      event: "Registration Deadline (payment of registration fees)",
      icon: "💳",
    },
    {
      date: "December 15-17, 2025",
      event: "Conference dates",
      icon: "🎯",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Important Dates
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto my-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Key deadlines and important dates for participants to ensure a
            smooth conference experience
          </p>
        </div>

        {/* Timeline Section */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-600"></div>

            {/* Timeline Items - Reduced spacing between items */}
            <div className="space-y-6">
              {dates.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="md:w-1/2 mb-3 md:mb-0 px-4">
                    <div
                      className={`bg-white p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        index % 2 === 0 ? "md:mr-6" : "md:ml-6"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <h3 className="text-lg font-bold text-blue-800">
                          {item.date}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-sm">{item.event}</p>
                    </div>
                  </div>

                  {/* Timeline Node - Smaller */}
                  <div className="hidden md:flex items-center justify-center z-10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-3 border-white shadow"></div>
                  </div>

                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accommodation Section */}
        <div className="max-w-4xl mx-auto mt-24 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Accommodation</h2>
          </div>
          <div className="bg-white p-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/4 pr-8">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Accommodation will be arranged in the guest houses on request
                  located within the Institute campus on single/sharing basis
                  based on the availability.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                  <p className="text-amber-800 flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      <span className="font-bold">Note:</span> No accommodation
                      is guaranteed after the registration deadline of October
                      31, 2025. with unique design and modern amenities.
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/4 mt-6 md:mt-0">
                <div className="bg-blue-100 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 text-lg mb-2">
                    Guest House Features
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Single/Sharing options
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Campus location
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Modern amenities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantDates;
