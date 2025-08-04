import React, { useState } from "react";
import { Download, FileText, Eye, ExternalLink } from "lucide-react";

const ExtendedAbstractFormat = () => {
  const [pdfError, setPdfError] = useState(false);

  const formatPath =
    "/ictacem2025/api/documents/format_for_Extended_Abstract.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = formatPath;
    link.download = "ICTACEM_2025_Extended_Abstract_Format.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(formatPath, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600">
            Extended Abstract Format
          </h1>
          <p className="text-xl mt-4 text-gray-600">
            Download the official format guidelines for extended abstracts
          </p>
        </div>

        {/* Format Document Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      Extended Abstract Format Guidelines
                    </h2>
                    <p className="text-green-100">
                      Official Formatting Requirements
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleView}
                    className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Preview Section */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Format Guidelines Include:
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Paper size and margin specifications</li>
                  <li>• Font type and size requirements</li>
                  <li>• Abstract length limitations</li>
                  <li>• Title and author formatting</li>
                  <li>• Reference and citation style</li>
                  <li>• Figure and table guidelines</li>
                  <li>• Template and examples</li>
                </ul>
              </div>

              {/* PDF Viewer */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Preview
                </h3>

                {!pdfError ? (
                  <div className="relative">
                    <iframe
                      src={formatPath}
                      className="w-full h-96 border rounded-lg"
                      title="Extended Abstract Format Guidelines"
                      onError={() => setPdfError(true)}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={handleView}
                        className="bg-black bg-opacity-70 text-white p-2 rounded-lg hover:bg-opacity-80 transition-all duration-200"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      PDF preview not available. Click the buttons above to view
                      or download the format guidelines.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handleView}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        View PDF
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Important Notes:
            </h3>
            <ul className="text-green-700 space-y-1">
              <li>• Please follow the format guidelines strictly</li>
              <li>
                • Extended abstracts must not exceed the specified page limit
              </li>
              <li>• Use the provided template for consistent formatting</li>
              <li>• Ensure all figures and tables are properly referenced</li>
            </ul>
            <p className="text-green-700 mt-4">
              For technical support, contact us at{" "}
              <a
                href="mailto:rananandi@aero.iitkgp.ac.in"
                className="underline hover:text-green-900"
              >
                rananandi@aero.iitkgp.ac.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedAbstractFormat;
