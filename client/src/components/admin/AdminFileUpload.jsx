import React, { useState } from "react";

const AdminFileUpload = ({ paperId, onFileUploaded, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [visibleToUser, setVisibleToUser] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a PDF file only.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("adminFile", selectedFile);
      formData.append("description", description);
      formData.append("fileType", "review_comment_file");
      formData.append("visibleToUser", visibleToUser);

      const response = await fetch(
        `/ictacem2025/api/admin/papers/${paperId}/upload-file`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // Important for cookie authentication
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        onFileUploaded(result.paper || result.file); // Use the full paper if available, fallback to file
        onClose();
      } else {
        setError(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-green-600 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Upload Review Comment File
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Brief description of this file..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visibleToUser"
              checked={visibleToUser}
              onChange={(e) => setVisibleToUser(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="visibleToUser" className="text-sm text-gray-700">
              Visible to paper author
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className={`flex-1 px-4 py-2 rounded text-white ${
                uploading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4 rounded-r">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-blue-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-700 font-medium">
                If you encounter a blank white page, simply refresh or reload
                the page to return.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFileUpload;
