import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookOfAbstracts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const bookPath = "/ictacem2025/api/documents/Technical Schedule.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bookPath;
    link.download = "ICTACEM_2025_Technical_Schedule.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handlePdfError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>

          <div className="mb-6">
            <i className="ri-calendar-schedule-line text-6xl text-emerald-200 mb-4"></i>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Technical Schedule
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Complete Technical Program for ICTACEM 2025 - Detailed schedule with
            all sessions, presentations, and conference events
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i className="ri-download-line text-lg"></i>
              Download PDF
            </button>

            <button
              onClick={() => window.open(bookPath, "_blank")}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i className="ri-external-link-line text-lg"></i>
              Open in New Tab
            </button>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                  <i className="ri-calendar-line text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Session Schedule
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Day-wise breakdown of all conference sessions with precise
                timings and venue information.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-teal-100 rounded-lg mr-4">
                  <i className="ri-presentation-line text-2xl text-teal-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Presentations
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Complete list of all presentations, keynotes, and plenary
                sessions with speaker names and topics.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-cyan-100 rounded-lg mr-4">
                  <i className="ri-map-pin-line text-2xl text-cyan-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Venue Details
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Detailed information about session venues, rooms, and locations
                throughout the conference facility.
              </p>
            </div>
          </div>

          {/* PDF Viewer Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <i className="ri-calendar-event-line text-emerald-600 mr-3 text-3xl"></i>
                Conference Technical Schedule
              </h2>
              <p className="text-gray-600 mt-2">
                Comprehensive program with all sessions, presentations, timings,
                and venue details
              </p>
            </div>

            <div className="relative">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading technical schedule...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center max-w-md mx-auto px-4">
                    <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                      <i className="ri-error-warning-line text-3xl text-red-600"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Unable to Load Document
                    </h3>
                    <p className="text-gray-600 mb-6">
                      There was an issue loading the technical schedule. Please
                      try downloading it directly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleDownload}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Download PDF
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Embed */}
              {!error && (
                <iframe
                  src={bookPath}
                  className="w-full h-screen border-0"
                  title="Technical Schedule Document"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? "none" : "block" }}
                />
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-start">
              <div className="p-2 bg-emerald-100 rounded-lg mr-4 flex-shrink-0">
                <i className="ri-information-line text-xl text-emerald-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  About This Schedule
                </h3>
                <div className="text-gray-600 space-y-2 text-sm">
                  <p className="flex items-start">
                    <i className="ri-arrow-right-s-line text-emerald-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    This document contains the complete technical schedule for
                    ICTACEM 2025, including all parallel sessions, keynote
                    talks, and plenary presentations.
                  </p>
                  <p className="flex items-start">
                    <i className="ri-arrow-right-s-line text-emerald-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Each session includes precise timing, venue location,
                    session chairs, and list of presentations with authors.
                  </p>
                  <p className="flex items-start">
                    <i className="ri-arrow-right-s-line text-emerald-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Use this schedule to plan your conference participation and
                    navigate between different sessions and venues.
                  </p>
                  <p className="flex items-start">
                    <i className="ri-arrow-right-s-line text-emerald-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Please check for any last-minute updates or changes
                    announced at the registration desk during the conference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conference Info Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <i className="ri-calendar-event-line text-emerald-600 mr-2"></i>
                Conference Schedule
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Date:</strong> December 15-17, 2025
                </p>
                <p>
                  <strong>Venue:</strong> Indian Institute of Technology
                  Kharagpur
                </p>
                <p>
                  <strong>Location:</strong> Kharagpur, West Bengal, India
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <i className="ri-question-line text-teal-600 mr-2"></i>
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                If you have any questions about the technical schedule or need
                assistance accessing the document, please contact us.
              </p>
              <button
                onClick={() =>
                  (window.location.href = "mailto:ictacem@aero.iitkgp.ac.in")
                }
                className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center"
              >
                <i className="ri-mail-line mr-1"></i>
                ictacem@aero.iitkgp.ac.in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOfAbstracts;
