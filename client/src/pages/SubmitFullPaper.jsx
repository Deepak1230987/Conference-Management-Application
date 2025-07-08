import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Notification from "../components/admin/Notification";

const SubmitFullPaper = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [paperDetails, setPaperDetails] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullPaperFile, setFullPaperFile] = useState(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const fetchPaperDetails = async () => {
      if (!paperId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/papers/${paperId}`);
        setPaperDetails(response.data.paper);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching paper details:", err);
        setNotification({
          type: "error",
          message: "Failed to load paper details. Please try again later.",
        });
        setIsLoading(false);
      }
    };

    fetchPaperDetails();
  }, [paperId]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) {
      setFullPaperFile(null);
      return;
    }

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed");
      setFullPaperFile(null);
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size should not exceed 10MB");
      setFullPaperFile(null);
      return;
    }

    setFullPaperFile(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullPaperFile) {
      setFileError("Please select a PDF file");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data
      const formData = new FormData();
      formData.append("fullPaperPdf", fullPaperFile);

      // Submit full paper
      await axios.post(`/api/papers/${paperId}/full-paper`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success notification
      setNotification({
        type: "success",
        message: "Full paper submitted successfully!",
      });

      // Redirect to profile after delay
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error submitting full paper:", err);
      setNotification({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to submit full paper. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If auth is loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin absolute top-4 left-4"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 py-16">
      {notification && <Notification error={notification} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-white opacity-10 rounded-full"></div>
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Submit Full-Length Paper
                </h1>
                <div className="h-1 w-16 bg-blue-300 mt-2 mb-4"></div>
                <p className="text-blue-100">
                  Upload your complete research paper for ICTACEM-2025
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="p-6 sm:p-10">
                {paperDetails ? (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Paper Information
                      </h2>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Title</p>
                            <p className="font-medium text-gray-800">
                              {paperDetails.title}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ICTACEM ID</p>
                            <p className="font-mono text-gray-800">
                              {paperDetails.ictacemId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Theme</p>
                            <p className="text-gray-800">
                              {paperDetails.theme}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment ID</p>
                            <p className="font-mono text-gray-800">
                              {paperDetails.paymentId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full paper upload form */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Full-Length Paper (PDF)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF up to 10MB
                            </p>
                          </div>
                        </div>

                        {fileError && (
                          <p className="mt-2 text-sm text-red-600">
                            {fileError}
                          </p>
                        )}

                        {fullPaperFile && (
                          <div className="mt-3 flex items-center p-2 bg-blue-50 border border-blue-200 rounded-md">
                            <svg
                              className="h-5 w-5 text-blue-500 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">
                              {fullPaperFile.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({(fullPaperFile.size / 1024 / 1024).toFixed(2)}{" "}
                              MB)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="w-full sm:w-auto py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !fullPaperFile}
                          className={`w-full sm:w-auto py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          ${
                            isSubmitting || !fullPaperFile
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          }`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            "Submit Full Paper"
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Important Notes
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>
                                  Ensure your full paper follows the conference
                                  template and guidelines
                                </li>
                                <li>Maximum file size: 10MB</li>
                                <li>Only PDF format is accepted</li>
                                <li>
                                  Your submission is final - make sure all
                                  content is accurate
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Paper Not Found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      We couldn't find the paper you're trying to submit for.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Return to Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitFullPaper;
