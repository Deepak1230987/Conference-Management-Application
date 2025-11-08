import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentProcedure = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const paymentProcedurePath =
    "/ictacem2025/api/documents/PaymentProcedurePreview.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = paymentProcedurePath;
    link.download = "ICTACEM_2025_Payment_Procedure.pdf";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>

          <div className="mb-6">
            <i className="ri-bank-card-line text-6xl text-indigo-200 mb-4"></i>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Payment Procedure
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Complete guide for registration fee payment process for ICTACEM 2025
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i className="ri-download-line text-lg"></i>
              Download PDF
            </button>

            <button
              onClick={() => window.open(paymentProcedurePath, "_blank")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i className="ri-external-link-line text-lg"></i>
              Open in New Tab
            </button>
          </div>

          {/* Payment Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <i className="ri-secure-payment-line text-2xl text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Secure Payment
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                All payment transactions are processed through secure, encrypted
                channels to ensure your financial information remains protected.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <i className="ri-customer-service-line text-2xl text-purple-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Support Available
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Need help with payment? Our support team is available to assist
                you throughout the registration process.
              </p>
            </div>
          </div>

          {/* PDF Viewer Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <i className="ri-file-pdf-line text-indigo-600 mr-3 text-3xl"></i>
                Payment Procedure Document
              </h2>
              <p className="text-gray-600 mt-2">
                Detailed instructions for completing your registration fee
                payment
              </p>
            </div>

            <div className="relative">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading payment procedure document...
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
                      There was an issue loading the payment procedure document.
                      Please try downloading it directly or contact support.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleDownload}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
                  src={paymentProcedurePath}
                  className="w-full h-screen border-0"
                  title="Payment Procedure Document"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? "none" : "block" }}
                />
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-start">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4 flex-shrink-0">
                <i className="ri-information-line text-xl text-indigo-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Important Notes
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-start">
                    <i className="ri-arrow-right-s-line text-indigo-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Please follow the payment procedure carefully to ensure
                    successful registration
                  </li>
                  <li className="flex items-start">
                    <i className="ri-arrow-right-s-line text-indigo-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Keep your payment receipt/transaction ID for future
                    reference
                  </li>
                  <li className="flex items-start">
                    <i className="ri-arrow-right-s-line text-indigo-500 mt-0.5 mr-1 flex-shrink-0"></i>
                    Contact support if you encounter any issues during the
                    payment process
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcedure;
