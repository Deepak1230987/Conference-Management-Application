import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubmitPaper = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedPaperTitle, setSubmittedPaperTitle] = useState("");
  const [activeStep, setActiveStep] = useState(1); // Track form steps: 1=Paper Details, 2=Authors, 3=Upload
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [ictacemId, setIctacemId] = useState("");
  const [modeOfPresentation, setModeOfPresentation] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  // Submission limit state
  const [paperCount, setPaperCount] = useState(0);
  const [reachedSubmissionLimit, setReachedSubmissionLimit] = useState(false);

  // Auto-populate ICTACEM ID from user profile
  useEffect(() => {
    if (user && user.customUserId) {
      setIctacemId(user.customUserId);
    }
  }, [user]);

  // Check user's existing paper count when component loads
  useEffect(() => {
    const checkPaperCount = async () => {
      if (user) {
        try {
          const response = await axios.get("/api/papers/user-submissions");
          const count = response.data.count || 0;
          setPaperCount(count);

          // Check if user has reached the submission limit (2 papers)
          if (count >= 1) {
            setReachedSubmissionLimit(true);
          }
        } catch (err) {
          console.error("Error fetching paper count:", err);
        }
      }
    };

    if (!loading && isAuthenticated) {
      checkPaperCount();
    }
  }, [user, loading, isAuthenticated]);

  // Authors state (array of authors with name, affiliation, address)
  const [authors, setAuthors] = useState([
    { name: "", affiliation: "", address: "" },
  ]);

  // Themes for dropdown
  const themes = [
    "Aerodymanics and Fluid Mechanics",
    "Solid Mechanics and Dynamics",
    "Flight Mechanics, Control and Navigation",
    "Propulsion and Combustion",
  ];

  // Mode of Presentation options
  const presentationModes = [
    "Oral",
    "Poster (Only for Students)",
    "Video (Only for Students)",
  ];

  // Add author field
  const addAuthor = () => {
    setAuthors([...authors, { name: "", affiliation: "", address: "" }]);
  };

  // Remove author field
  const removeAuthor = (index) => {
    if (authors.length > 1) {
      const newAuthors = [...authors];
      newAuthors.splice(index, 1);
      setAuthors(newAuthors);
    }
  };

  // Handle author field changes
  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...authors];
    newAuthors[index][field] = value;
    setAuthors(newAuthors);
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Process the selected or dropped file
  const processFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setPdfFile(file);
    setError("");
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle steps navigation
  const nextStep = () => {
    if (activeStep === 1) {
      if (!title || !theme || !ictacemId || !modeOfPresentation) {
        setError("Please complete all fields before proceeding");
        return;
      }
      setError("");
    }
    if (activeStep === 2) {
      const validAuthors = authors.every(
        (author) => author.name && author.affiliation && author.address
      );
      if (!validAuthors) {
        setError("Please complete all author fields before proceeding");
        return;
      }
      setError("");
    }
    setActiveStep(activeStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    setError("");
    window.scrollTo(0, 0);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user has reached submission limit
    if (reachedSubmissionLimit) {
      setError("You have reached the maximum limit of 2 paper submissions.");
      return;
    }

    // Validation
    if (!title || !theme || !ictacemId || !pdfFile) {
      setError("All fields are required");
      return;
    }

    // Validate authors
    const validAuthors = authors.every(
      (author) => author.name && author.affiliation && author.address
    );

    if (!validAuthors) {
      setError("All author fields are required");
      return;
    }

    setSubmitLoading(true);
    setError("");

    try {
      // Create form data
      const formData = new FormData();
    

      formData.append("title", title);
      formData.append("theme", theme);
      formData.append("ictacemId", ictacemId);
      formData.append("modeOfPresentation", modeOfPresentation);
      formData.append("authors", JSON.stringify(authors));
      formData.append("paperPdf", pdfFile);

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send request
      const response = await axios.post("/api/papers/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      // Store the title for display in success message
      setSubmittedPaperTitle(title);

      // Show success modal instead of just a message
      setShowSuccessModal(true);

      // Reset form
      setTitle("");
      setTheme("");
      setIctacemId("");
      setModeOfPresentation("");
      setPdfFile(null);
      setAuthors([{ name: "", affiliation: "", address: "" }]);

      // Clear any file input value
      const fileInput = document.getElementById("paperPdf");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      // Extract the specific error message from the response
      const errorMessage =
        err.response?.data?.message || "Failed to submit paper";
      setError(errorMessage);

      // If the error is about duplicate ICTACEM ID, stay on the first step
      if (errorMessage.includes("ICTACEM ID already exists")) {
        setActiveStep(1); // Go back to the first step where ICTACEM ID is entered
      } else {
        // For other errors, show the form again from the beginning
        setActiveStep(1);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // // Handle submit another paper
  // const handleSubmitAnother = () => {
  //   setShowSuccessModal(false);
  //   window.scrollTo(0, 0);
  // };

  // Close modal handler
  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  // Handle view submissions
  const handleViewSubmissions = () => {
    navigate("/profile");
  };

  // Redirect if not authenticated - modified to consider loading state
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: "/submit-paper" } });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-75"></div>
      </div>
    );
  }

  // Only show the "please login" message after we've confirmed they're not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <svg
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-12a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to submit your paper to ICTACEM 2025.
          </p>
          <button
            onClick={() =>
              navigate("/login", { state: { from: "/submit-paper" } })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Paper Submission
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete the form below to submit your paper to the International
            Conference on Theoretical, Applied, Computational and Experimental
            Mechanics (ICTACEM 2025).
          </p>

          {/* Submission Limit Status */}
          <div className="mt-4 flex justify-center">
            <div
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium
              ${
                paperCount >= 1
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {paperCount >= 1
                  ? "You have reached the maximum limit of 1 paper submissions"
                  : `You have submitted ${paperCount} of 1 allowed papers`}
              </span>
            </div>
          </div>
        </div>

        {/* Show notice and disable form if limit reached */}
        {reachedSubmissionLimit ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Submission Limit Reached
            </h2>
            <p className="text-gray-600 mb-6">
              You have already submitted the maximum allowed number of papers
              (1) for ICTACEM 2025. If you need to modify a previous submission,
              please contact the conference organizers.
            </p>
            <button
              onClick={handleViewSubmissions}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              View My Submissions
            </button>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-full max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center ${
                          activeStep >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        1
                      </div>
                      <span className="text-sm mt-2 font-medium">
                        Paper Details
                      </span>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-4 ${
                        activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    ></div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center ${
                          activeStep >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        2
                      </div>
                      <span className="text-sm mt-2 font-medium">Authors</span>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-4 ${
                        activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    ></div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full h-10 w-10 flex itemsCenter justify-center ${
                          activeStep >= 3
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        3
                      </div>
                      <span className="text-sm mt-2 font-medium">
                        Upload & Submit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md"
                role="alert"
              >
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Success modal with close button */}
            {showSuccessModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-400/20 backdrop-blur-sm">
                <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl relative transform transition-all animate-fade-in-up">
                  {/* Close button */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 rounded-full p-3 mb-4">
                      <svg
                        className="w-16 h-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Submission Successful!
                    </h3>
                    <p className="text-gray-600 text-center mb-8 max-w-xs">
                      Your paper{" "}
                      <span className="font-medium text-blue-600">
                        "{submittedPaperTitle}"
                      </span>{" "}
                      has been successfully submitted. Thank you!
                    </p>
                    <div className="flex flex-col sm:flex-row w-full gap-4">
                     
                      <button
                        onClick={handleViewSubmissions}
                        className="w-full px-6 py-3 bg-blue-600 text-gray-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      >
                        View My Submissions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-step form */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeStep === 1
                    ? "Paper Details"
                    : activeStep === 2
                    ? "Author Information"
                    : "Upload Paper"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Step 1: Paper Details */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="title"
                      >
                        Paper Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the full title of your paper"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 font-semibold mb-2"
                        htmlFor="theme"
                      >
                        Paper Theme <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="theme"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        style={{
                          backgroundImage:
                            'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="%23555"/></svg>\')',
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                        }}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        required
                      >
                        <option value="">Select a theme</option>
                        {themes.map((theme) => (
                          <option key={theme} value={theme}>
                            {theme}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          htmlFor="ictacemId"
                        >
                          ICTACEM ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="ictacemId"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={ictacemId}
                          onChange={(e) => setIctacemId(e.target.value)}
                          placeholder="e.g., ICTACEMP2025XYZ"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Enter the ID provided by the conference organizers
                        </p>
                      </div>
                      <div className="mb-6">
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          htmlFor="modeOfPresentation"
                        >
                          Mode of Presentation{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="modeOfPresentation"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                          style={{
                            backgroundImage:
                              'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="%23555"/></svg>\')',
                            backgroundPosition: "right 12px center",
                            backgroundRepeat: "no-repeat",
                          }}
                          value={modeOfPresentation}
                          onChange={(e) =>
                            setModeOfPresentation(e.target.value)
                          }
                          required
                        >
                          <option value="">Select mode of presentation</option>
                          {presentationModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                          Any of the above mode of presentation requires
                          in-person presentation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Authors */}
                {activeStep === 2 && (
                  <div>
                    <p className="mb-6 text-gray-600">
                      Add all authors of the paper. The first author will be
                      considered the primary author.
                    </p>

                    <div className="space-y-6">
                      {authors.map((author, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                            <h3 className="font-semibold text-blue-600 text-lg flex items-center">
                              <span className="inline-block w-8 h-8 pl-3 py-auto rounded-full bg-blue-100 text-blue-600  items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              {index === 0
                                ? "Primary Author"
                                : `Co-Author ${index}`}
                            </h3>
                            {authors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAuthor(index)}
                                className="text-red-500 hover:text-red-700 focus:outline-none flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor={`author-name-${index}`}
                              >
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                id={`author-name-${index}`}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={author.name}
                                onChange={(e) =>
                                  handleAuthorChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Full name of author"
                                required
                              />
                            </div>

                            <div>
                              <label
                                className="block text-gray-700 font-semibold mb-2"
                                htmlFor={`author-affiliation-${index}`}
                              >
                                Affiliation/Organization{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                id={`author-affiliation-${index}`}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={author.affiliation}
                                onChange={(e) =>
                                  handleAuthorChange(
                                    index,
                                    "affiliation",
                                    e.target.value
                                  )
                                }
                                placeholder="University or Organization"
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label
                              className="block text-gray-700 font-semibold mb-2"
                              htmlFor={`author-address-${index}`}
                            >
                              Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id={`author-address-${index}`}
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              value={author.address}
                              onChange={(e) =>
                                handleAuthorChange(
                                  index,
                                  "address",
                                  e.target.value
                                )
                              }
                              placeholder="Full postal address"
                              required
                            ></textarea>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addAuthor}
                      className="mt-6 px-5 py-2.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 focus:outline-none border border-green-200 flex items-center font-medium transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Another Author
                    </button>
                  </div>
                )}

                {/* Step 3: Upload */}
                {activeStep === 3 && (
                  <div>
                    <div className="mb-8">
                      <label
                        className="block text-gray-700 font-semibold mb-3"
                        htmlFor="paperPdf"
                      >
                        Upload Paper (PDF){" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
                          ${
                            dragActive
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                          }
                          ${pdfFile ? "border-green-500 bg-green-50" : ""}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {/* Use a visually hidden input (not "display: none") that's still technically in the DOM */}
                        <input
                          ref={fileInputRef}
                          id="paperPdf"
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="absolute w-0 h-0 opacity-0 pointer-events-none"
                          aria-hidden="true"
                          tabIndex="-1"
                          // Don't use the required attribute, we'll handle validation manually
                        />
                        <label
                          htmlFor="paperPdf"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          {pdfFile ? (
                            <>
                              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <svg
                                  className="w-10 h-10 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="text-green-600 font-medium text-lg">
                                  File selected
                                </p>
                                <p className="text-gray-600 font-medium mt-2">
                                  {pdfFile.name}
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                  {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                                <button
                                  type="button"
                                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                  onClick={() => {
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = "";
                                      fileInputRef.current.click();
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  Change File
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-16 h-16 text-gray-400 mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                              </svg>
                              <div>
                                <p className="text-gray-700 font-medium text-lg">
                                  Drag & drop your PDF file here
                                </p>
                                <p className="text-gray-500 text-sm mt-2 mb-3">
                                  — or —
                                </p>
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
                                  onClick={() => fileInputRef.current.click()}
                                >
                                  Browse Files
                                </button>
                              </div>
                              <p className="text-gray-500 text-xs mt-4">
                                Only PDF format is accepted
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                      {/* Custom validation message for file input */}
                      {!pdfFile && activeStep === 3 && (
                        <p className="mt-2 text-amber-600 text-sm">
                          Please select a PDF file to upload
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Submission Summary
                      </h3>
                      <ul className="text-gray-700 space-y-2">
                        <li className="flex">
                          <span className="font-medium w-32">Title:</span>
                          <span className="flex-1">{title}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Theme:</span>
                          <span className="flex-1">{theme}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Mode:</span>
                          <span className="flex-1">{modeOfPresentation}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Authors:</span>
                          <span className="flex-1">
                            {authors.map((a) => a.name).join(", ")}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">ICTACEM ID:</span>
                          <span className="flex-1">{ictacemId}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex items-center mb-6">
                        <input
                          type="checkbox"
                          id="confirm"
                          className="h-5 w-5 text-blue-600"
                          required
                        />
                        <label htmlFor="confirm" className="ml-3 text-gray-700">
                          I confirm that the uploaded paper adheres to the
                          conference guidelines and all information provided is
                          accurate.
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form navigation buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Previous
                    </button>
                  )}

                  <div className="ml-auto">
                    {activeStep < 3 && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
                      >
                        Next
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                    {activeStep === 3 && (
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className={`px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center ${
                          submitLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {submitLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
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
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Paper
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Help Section */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble submitting your paper or have questions
                about the submission process, please contact our support team.
              </p>
              <div className="flex items-center text-blue-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <a
                  href="mailto:rananandi@aero.iitkgp.ac.in"
                  className="hover:underline"
                >
                  {" "}
                  rananandi@aero.iitkgp.ac.in
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SubmitPaper;
