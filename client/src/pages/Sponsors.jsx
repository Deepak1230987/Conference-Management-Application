import React, { useState } from "react";
import { ExternalLink, MapPin, Globe } from "lucide-react";

const Sponsors = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample sponsors data - you can update this with real sponsor information
  const sponsors = {
    platinum: [
      {
        id: 1,
        name: "TechCorp Industries",
        logo: "/api/placeholder/200/100",
        website: "https://techcorp.com",
        description: "Leading aerospace technology solutions provider",
        location: "Mumbai, India",
        category: "platinum",
      },
    ],
    gold: [
      {
        id: 2,
        name: "Aerospace Dynamics",
        logo: "/api/placeholder/180/90",
        website: "https://aerodynamics.com",
        description: "Advanced computational fluid dynamics software",
        location: "Bangalore, India",
        category: "gold",
      },
      {
        id: 3,
        name: "MechSim Solutions",
        logo: "/api/placeholder/180/90",
        website: "https://mechsim.com",
        description: "Mechanical simulation and analysis tools",
        location: "Chennai, India",
        category: "gold",
      },
    ],
    silver: [
      {
        id: 4,
        name: "Materials Research Co.",
        logo: "/api/placeholder/160/80",
        website: "https://materialsresearch.com",
        description: "Advanced materials testing and development",
        location: "Pune, India",
        category: "silver",
      },
      {
        id: 5,
        name: "Engineering Innovators",
        logo: "/api/placeholder/160/80",
        website: "https://enginnovators.com",
        description: "Innovative engineering solutions and consulting",
        location: "Delhi, India",
        category: "silver",
      },
      {
        id: 6,
        name: "CAD Systems Ltd",
        logo: "/api/placeholder/160/80",
        website: "https://cadsystems.com",
        description: "Professional CAD and design software solutions",
        location: "Hyderabad, India",
        category: "silver",
      },
    ],
    bronze: [
      {
        id: 7,
        name: "Precision Instruments",
        logo: "/api/placeholder/140/70",
        website: "https://precisioninst.com",
        description: "High-precision measurement instruments",
        location: "Kolkata, India",
        category: "bronze",
      },
      {
        id: 8,
        name: "Research Labs Inc",
        logo: "/api/placeholder/140/70",
        website: "https://researchlabs.com",
        description: "Laboratory equipment and testing services",
        location: "Ahmedabad, India",
        category: "bronze",
      },
      {
        id: 9,
        name: "TechBooks Publications",
        logo: "/api/placeholder/140/70",
        website: "https://techbooks.com",
        description: "Technical and academic publications",
        location: "Mumbai, India",
        category: "bronze",
      },
      {
        id: 10,
        name: "Digital Solutions Hub",
        logo: "/api/placeholder/140/70",
        website: "https://digitalhub.com",
        description: "Digital transformation and IT solutions",
        location: "Gurgaon, India",
        category: "bronze",
      },
    ],
  };

  const categories = [
    {
      id: "all",
      name: "All Sponsors",
      count: Object.values(sponsors).flat().length,
    },
    { id: "platinum", name: "Platinum", count: sponsors.platinum.length },
    { id: "gold", name: "Gold", count: sponsors.gold.length },
    { id: "silver", name: "Silver", count: sponsors.silver.length },
    { id: "bronze", name: "Bronze", count: sponsors.bronze.length },
  ];

  const getFilteredSponsors = () => {
    if (selectedCategory === "all") {
      return Object.values(sponsors).flat();
    }
    return sponsors[selectedCategory] || [];
  };

  const getSponsorTierInfo = (tier) => {
    const tierInfo = {
      platinum: {
        color: "from-slate-500 via-slate-600 to-slate-700",
        textColor: "text-slate-100",
        borderColor: "border-slate-400",
        bgColor: "bg-slate-50",
      },
      gold: {
        color: "from-yellow-400 via-yellow-500 to-yellow-600",
        textColor: "text-yellow-900",
        borderColor: "border-yellow-400",
        bgColor: "bg-yellow-50",
      },
      silver: {
        color: "from-gray-400 via-gray-500 to-gray-600",
        textColor: "text-gray-900",
        borderColor: "border-gray-400",
        bgColor: "bg-gray-50",
      },
      bronze: {
        color: "from-orange-400 via-orange-500 to-orange-600",
        textColor: "text-orange-900",
        borderColor: "border-orange-400",
        bgColor: "bg-orange-50",
      },
    };
    return tierInfo[tier] || tierInfo.bronze;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <i className="ri-building-line text-6xl text-blue-200 mb-4"></i>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Sponsors</h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            We are grateful to our sponsors who make ICTACEM 2025 possible.
            Their support enables us to bring together the global community of
            researchers, academics, and industry professionals in theoretical,
            applied, computational, and experimental mechanics.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sponsors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {getFilteredSponsors().map((sponsor) => {
              const tierInfo = getSponsorTierInfo(sponsor.category);
              return (
                <div
                  key={sponsor.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${tierInfo.borderColor} hover:scale-105`}
                >
                  {/* Tier Badge */}
                  <div
                    className={`bg-gradient-to-r ${tierInfo.color} px-4 py-2`}
                  >
                    <span
                      className={`text-sm font-bold uppercase ${tierInfo.textColor}`}
                    >
                      {sponsor.category}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Logo Placeholder */}
                    <div className="mb-4 flex justify-center">
                      <div
                        className={`w-32 h-16 ${tierInfo.bgColor} ${tierInfo.borderColor} border-2 rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-gray-500 text-sm font-medium">
                          {sponsor.name}
                        </span>
                      </div>
                    </div>

                    {/* Sponsor Info */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                      {sponsor.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 text-center leading-relaxed">
                      {sponsor.description}
                    </p>

                    <div className="flex items-center justify-center text-gray-500 text-xs mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      {sponsor.location}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.open(sponsor.website, "_blank")}
                        className={`flex items-center gap-2 bg-gradient-to-r ${tierInfo.color} ${tierInfo.textColor} px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium`}
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Sponsors Message */}
          {getFilteredSponsors().length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4">
                <i className="ri-building-line text-6xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No sponsors in this category yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're actively seeking sponsors in this tier. Interested in
                supporting ICTACEM 2025?
              </p>
              <button
                onClick={() => (window.location.href = "/sponsorship")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Learn About Sponsorship
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Interested in Sponsoring ICTACEM 2025?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our prestigious list of sponsors and connect with leading
              researchers, academics, and industry professionals from around the
              world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/sponsorship")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <i className="ri-hand-heart-line text-lg"></i>
                Become a Sponsor
              </button>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i className="ri-mail-line text-lg"></i>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Thank You to Our Sponsors
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The success of ICTACEM 2025 is made possible through the generous
              support of our sponsors. Their commitment to advancing research
              and education in mechanics and engineering enables us to provide
              an exceptional conference experience, foster collaboration, and
              drive innovation in our field. We are deeply grateful for their
              partnership and investment in the future of theoretical, applied,
              computational, and experimental mechanics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
