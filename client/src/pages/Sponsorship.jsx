import React, { useState } from "react";
import {
  Download,
  FileText,
  Eye,
  ExternalLink,
  Star,
  Users,
  Award,
  Building2,
  Mail,
} from "lucide-react";

const Sponsorship = () => {
  const [pdfError, setPdfError] = useState(false);

  const sponsorshipBrochurePath =
    "/ictacem2025/api/documents/ICTACEM-2025_Sponsorship_Brochure.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = sponsorshipBrochurePath;
    link.download = "ICTACEM_2025_Sponsorship_Brochure.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(sponsorshipBrochurePath, "_blank");
  };

  const sponsorshipTiers = [
    {
      tier: "Platinum",
      price: "Rs. 2,50,000",
      icon: <Star className="w-8 h-8 text-[#E5E4E2]" />,
      color: "bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700",
      textColor: "text-[#E5E4E2]",
      highlight: "border-slate-500 shadow-slate-300",
      benefits: [
        "Front inner full page in colour in Book of Abstracts",
        "4 free conference registrations",
        "1 exhibition booth",
        "Company logo on banners, website, communications",
        "Brochure/pamphlet in registration kit",
        "Limited to one sponsor",
      ],
    },
    {
      tier: "Gold",
      price: "Rs. 2,00,000",
      icon: <Award className="w-8 h-8 text-[#E5E4E2]" />,
      color: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600",
      textColor: "text-[#E5E4E2]",
      highlight: "border-yellow-500 shadow-yellow-300",
      benefits: [
        "Back inner full page in colour in Book of Abstracts",
        "3 free conference registrations",
        "1 exhibition booth",
        "Company logo on banners, website, communications",
        "Brochure/pamphlet in registration kit",
        "Limited to one sponsor",
      ],
    },
    {
      tier: "Silver",
      price: "Rs. 1,50,000",
      icon: <Building2 className="w-8 h-8 text-[#E5E4E2]" />,
      color: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      textColor: "text-[#E5E4E2]",
      highlight: "border-gray-500 shadow-gray-300",
      benefits: [
        "Full page in colour in Book of Abstracts",
        "2 free conference registrations",
        "1 exhibition booth",
        "Company logo on banners, website, communications",
        "Brochure/pamphlet in registration kit",
      ],
    },
    {
      tier: "Bronze",
      price: "Rs. 1,00,000",
      icon: <Building2 className="w-8 h-8 text-[#E5E4E2]" />,
      color: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
      textColor: "text-[#E5E4E2]",
      highlight: "border-orange-500 shadow-orange-300",
      benefits: [
        "Half page in colour in Book of Abstracts",
        "1 free conference registration",
        "1 exhibition booth",
        "Company logo on banners, website, communications",
        "Brochure/pamphlet in registration kit",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">
            Sponsorship Opportunities
          </h1>
          <p className="text-xl mt-4 text-gray-600">
            IIT Kharagpur | December 15-17, 2025
          </p>
          <p className="text-lg mt-2 text-gray-500">
            International Conference on Theoretical Applied Computational and
            Experimental Mechanics
          </p>
        </div>

        {/* Sponsorship Overview */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Sponsor ICTACEM-2025?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ICTACEM, held every three years since 1998, provides a platform
                for scientists and engineers to exchange views on latest
                developments in Mechanics. This 9th edition at IIT Kharagpur
                will bring together academicians and researchers from various
                disciplines of mechanics to share knowledge between people from
                different parts of the globe.
              </p>
            </div>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Flagship Sponsorship Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our premium sponsorship tiers designed to maximize
              your brand visibility and engagement with the international
              mechanics community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 ${tier.highlight} relative`}
              >
                {/* Premium Badge for Platinum */}
                {tier.tier === "Platinum" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div
                  className={`${tier.color} ${tier.textColor} p-8 text-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="mb-4 transform hover:rotate-12 transition-transform duration-300">
                      {tier.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{tier.tier}</h3>
                    <div className="text-2xl font-extrabold mb-1">
                      {tier.price}
                    </div>
                    <div className="text-sm opacity-80 font-medium">
                      {tier.tier === "Platinum" || tier.tier === "Gold"
                        ? "Limited Availability"
                        : "Multiple Available"}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
                </div>

                {/* Benefits Section */}
                <div className="p-6">
                  <ul className="space-y-4">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-200">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                All Flagship Sponsors Receive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Company logos on conference banners & website</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Brochure/pamphlet inclusion in registration kits</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Recognition in all conference communications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sponsorship Opportunities */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Additional Sponsorship Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Conference Banquet Dinner
              </h3>
              <p className="text-gray-600 mb-3">Limited to 1 sponsor</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 4 free registrations</li>
                <li>• Brochures on dinner tables</li>
                <li>• Banner at dinner venue</li>
                <li>• Logo on invitation cards</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Sponsored Invited Talk
              </h3>
              <p className="text-gray-600 mb-3">Rs. 2,00,000</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Company profile audio-video screening</li>
                <li>• Before the invited talk</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Registration Kit Sponsorship
              </h3>
              <p className="text-gray-600 mb-3">Rs. 2,00,000 (Limited to 1)</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 2 free registrations</li>
                <li>• Company logo on bag and stationery</li>
                <li>• Brochures inclusion in bag</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Exhibition Booth
              </h3>
              <p className="text-gray-600 mb-3">Rs. 50,000</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Standalone exhibition space</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Tea Break Sponsorship
              </h3>
              <p className="text-gray-600 mb-3">Rs. 20,000 (Limited to 6)</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 1 free registration</li>
                <li>• Banner during tea time</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                Advertisement Options
              </h3>
              <p className="text-gray-600 mb-3">Book of Abstracts</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Full-page color: Rs. 20,000</li>
                <li>• Half-page color: Rs. 10,000</li>
                <li>• Brochure in kit: Rs. 10,000</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sponsorship Brochure Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Brochure Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Sponsorship Brochure</h2>
                    <p className="text-green-100">
                      View/Download the sponsorship brochure to get payment
                      details
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

            {/* Payment Information Section */}
            <div className="p-6">
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Payment Details Available in Brochure
                </h3>
                <p className="text-blue-700 mb-4">
                  Complete bank account details, payment instructions, and
                  contact information for sponsorship coordination are available
                  in the sponsorship brochure.
                </p>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium">
                  📄 <strong>Important:</strong> Please view or download the
                  sponsorship brochure below to access complete payment details
                  and bank account information required for sponsorship
                  payments.
                </p>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preview
              </h3>

              {!pdfError ? (
                <div className="relative">
                  <iframe
                    src={sponsorshipBrochurePath}
                    className="w-full h-96 border rounded-lg"
                    title="ICTACEM 2025 Sponsorship Brochure"
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
                    or download the sponsorship brochure.
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

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            Have queries?
          </h3>
          <p className="text-yellow-700 mb-4">
            For any further queries, feel free to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:ictacem@aero.iitkgp.ac.in"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              ictacem@aero.iitkgp.ac.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
