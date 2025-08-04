import React, { useState } from "react";
import { Download, FileText, Eye, ExternalLink } from "lucide-react";

const Brouchure = () => {
  const [pdfError, setPdfError] = useState(false);

  const brochurePath = "/ictacem2025/api/documents/ICTACEM 2025 Brochure.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = brochurePath;
    link.download = "ICTACEM_2025_Brochure.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(brochurePath, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">
            Conference Brochure
          </h1>
          <p className="text-xl mt-4 text-gray-600">
            Download or view our official ICTACEM 2025 brochure
          </p>
        </div>

        {/* Brochure Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      ICTACEM 2025 Brochure
                    </h2>
                    <p className="text-blue-100">
                      Official Conference Information
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleView}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200"
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
                  What's Inside:
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Conference overview and theme</li>
                  <li>• Important dates and deadlines</li>
                  <li>• Call for papers and submission guidelines</li>
                  <li>• Speaker information and keynote details</li>
                  <li>• Registration information and fees</li>
                  <li>• Venue details and accommodation</li>
                  <li>• Contact information</li>
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
                      src={brochurePath}
                      className="w-full h-96 border rounded-lg"
                      title="ICTACEM 2025 Brochure"
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
                      or download the brochure.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handleView}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        View PDF
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Last updated: January 2025</p>
                <p>File format: PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-700">
              If you're having trouble viewing or downloading the brochure,
              please contact us at{" "}
              <a
                href="mailto:info@ictacem2025.com"
                className="underline hover:text-blue-900"
              >
                ictacem@aero.iitkgp.ac.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brouchure;
