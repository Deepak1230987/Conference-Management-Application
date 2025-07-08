import React from "react";

const Committee = () => {
  
// Committee data organized by sections

  // const committeeData = [
  //   {
  //     title: "Patrons",
  //     members: [
  //       { name: "Prof. V. K. Tewari", position: "Director, IIT Kharagpur" },
  //     ],
  //   },
  //   {
  //     title:
  //       "SECRETARIATS OF JOINT CONFERENCE OF ICTACEM, APCATS, AJSAE AND AESI, KOLKATA",
  //     members: [
  //       {
  //         name: "Mr. A. S. Kiran Kumar",
  //         position: "Patron, President, AeSI, New Delhi, Ex-Chairman, ISRO",
  //       },
  //       {
  //         name: "Prof. M. Sinha",
  //         position:
  //           "Mentor, HoD, Department of Aerospace Engineering, IIT Kharagpur",
  //       },
  //       {
  //         name: "Gp. Capt. T. K. Ray",
  //         position: "Mentor, Chairman, AeSI, Kolkata",
  //       },
  //       {
  //         name: "Prof. K. P. Sinhamahapatra",
  //         position:
  //           "Conference Chair, Department of Aerospace Engineering, IIT Kharagpur",
  //         email: "ictacem@aero.iitkgp.ac.in",
  //       },
  //       {
  //         name: "Prof. C. D. Kong",
  //         position:
  //           "Conference Chair, International Visiting Professor, Department of Aerospace Engineering, IIT Kharagpur",
  //         email: "cdgong@aero.iitkgp.ac.in",
  //       },
  //       {
  //         name: "Prof. B. N. Singh",
  //         position:
  //           "Conference Vice-Chair, Department of Aerospace Engineering, IIT Kharagpur",
  //         email: "ictacem@aero.iitkgp.ac.in",
  //       },
  //       {
  //         name: "Prof. Amar Nath Mallick",
  //         position:
  //           "EC Member, AeSI, Kolkata Chapter & Professor, Department of Mechanical Engineering, NIT, Durgapur",
  //         email: "amarnath.mullick@me.nitdgp.ac.in",
  //       },
  //     ],
  //   },
  //   {
  //     title:
  //       "INTERNATIONAL COMMITTEE OF JOINT CONFERENCE OF ICTACEM, APCATS, AJSAE AND AeSI, KOLKATA",
  //     members: [
  //       {
  //         name: "Prof. Xue-Ying Deng",
  //         position: "Honorary Chair, Beihang University, China",
  //       },
  //       {
  //         name: "Prof. C. D. Kong",
  //         position: "Honorary Chair, Chosun University, Korea",
  //       },
  //       {
  //         name: "Dr. C. Y. Hwang",
  //         position:
  //           "Honorary Co-Chair, Korea Aerospace Research Institute, Korea",
  //       },
  //       {
  //         name: "Prof. S. S. Lee",
  //         position: "Honorary Co-Chair; Gyeongsang National University, Korea",
  //       },
  //       {
  //         name: "Prof. J. H. Hwang",
  //         position: "Honorary Co-Chair. Korea Aerospace University, Korea",
  //       },
  //       {
  //         name: "Prof. Yankui Wang",
  //         position: "Honorary Co-Chair, Beihang University, China",
  //       },
  //       {
  //         name: "Prof. Hai Huang",
  //         position: "Honorary Co-Chair, Beihang University, China",
  //       },
  //       {
  //         name: "Prof. Guowei Yang",
  //         position: "Honorary Co-Chair, ARMC, CAS, China",
  //       },
  //       {
  //         name: "Prof. Nobuhiko Yamasaki",
  //         position: "Honorary Co-Chair, Kyushu University, Japan",
  //       },
  //       {
  //         name: "Prof. Tai-Yan Kam",
  //         position:
  //           "Honorary Co-Chair, National Chiao Tung University, Taiwan, China",
  //       },
  //       {
  //         name: "Prof. Mahir Dursun",
  //         position: "Honorary Co-Chair, Gazi University, Turkey",
  //       },
  //     ],
  //   },
  //   {
  //     title: "INTERNATIONAL REPRESENTATIVES",
  //     members: [
  //       {
  //         name: "Prof. D. K. Maiti",
  //         position: "Department of Aerospace Engineering, IIT Kharagpur",
  //         email: "dkmaiti@aero.iitkgp.ac.in",
  //       },
  //       {
  //         name: "Dr. C. Y. Hwang",
  //         position: "Korea Aerospace Research Institute",
  //         email: "cyhwang@kari.re.kr",
  //       },
  //       {
  //         name: "Prof. Shenyan Chen",
  //         position: "Beihang University",
  //         email: "chenshenyan@buaa.edu.cn",
  //       },
  //       {
  //         name: "Prof. Nobuhiko Yamasaki",
  //         position: "Kyushu University",
  //         email: "yamasaki@aero.kyushu-u.ac.jp",
  //       },
  //       {
  //         name: "Prof. J. L. Tsai",
  //         position: "National Chiao Tung University",
  //         email: "jialin@mail.nctu.edu.tw",
  //       },
  //       {
  //         name: "Prof. Mahir Dursun",
  //         position: "Gazi University",
  //         email: "mdursun@gazi.edu.tr",
  //       },
  //     ],
  //   },
  //   {
  //     title: "ICTACEM SECRETARIAT",
  //     members: [
  //       {
  //         name: "Prof. V K Tewari",
  //         position: "Director, IIT Kharagpur (Patron)",
  //       },
  //       {
  //         name: "Prof. M Sinha",
  //         position: "Head of the department, Aerospace Engineering (Mentor)",
  //       },
  //       {
  //         name: "Prof. K P Sinhamahapatra",
  //         position: "(Chairman)",
  //         email: "ictacem@aero.iitkgp.ac.in",
  //       },
  //       {
  //         name: "Prof. B N Singh",
  //         position: "(Vice-Chairman)",
  //         email: "ictacem@aero.iitkgp.ac.in",
  //       },
  //       { name: "Prof. A Roy", position: "(Secretary Fluid Mechanics)" },
  //       {
  //         name: "Prof. S M Dash",
  //         position: "(Joint Secretary Fluid Mechanics)",
  //       },
  //       {
  //         name: "Prof. M K Laha",
  //         position: "(Secretary Flight Mechanics, Control and Navigation)",
  //       },
  //       {
  //         name: "Prof. S Bhattacharyya",
  //         position:
  //           "(Joint Secretary Flight Mechanics, Control and Navigation)",
  //       },
  //       {
  //         name: "Prof. Amardip Ghosh",
  //         position: "(Secretary Propulsion & Combustion)",
  //       },
  //       {
  //         name: "Prof. S Karmakar, Prof. C S Mistry",
  //         position: "(Joint Secretary Propulsion & Combustion )",
  //       },
  //       {
  //         name: "Prof. B N Singh",
  //         position: "(Secretary Solid Mechanics and Dynamics)",
  //       },
  //       {
  //         name: "Prof. M R Sunny",
  //         position: "(Joint Secretary Solid Mechanics and Dynamics)",
  //       },
  //       {
  //         name: "Prof. D K Maiti",
  //         position: "(Secretary International relations & Sponsorship)",
  //       },
  //       {
  //         name: "Prof. P Jana",
  //         position: "(Joint Secretary International relations & Sponsorship )",
  //       },
  //       {
  //         name: "Prof. S Saha, Prof S Hota",
  //         position: "(Secretary Media & publication)",
  //       },
  //       {
  //         name: "Prof. R Joarder, Prof. A Prakash",
  //         position: "(Secretary Finance)",
  //       },
  //     ],
  //   },
  //   {
  //     title: "TECHNICAL COMMITTEE",
  //     members: [
  //       {
  //         name: "Prof. Somnath Ghosh, Prof. Mrinal Kaushik",
  //         position: "(Aerodynamics)",
  //       },
  //       {
  //         name: "Prof. N K Payada, Prof S Bhattacharyya",
  //         position: "(Flight Mechanics)",
  //       },
  //       {
  //         name: "Prof. S Karmakar, Prof. C S Mistry, Prof. Amardip Ghosh",
  //         position: "(Propulsion)",
  //       },
  //       {
  //         name: "Prof. Anup Ghosh, Prof. Mira Mitra",
  //         position: "(Structures)",
  //       },
  //     ],
  //   },
  //   {
  //     title: "ACCOMMODATION COMMITTEE",
  //     members: [
  //       {
  //         name: "Prof. S M Dash, Prof. S C Pradhan and Mr. S Mukherjee",
  //         position: "",
  //       },
  //     ],
  //   },
  //   {
  //     title: "TRANSPORTATION COMMITTEE",
  //     members: [
  //       { name: "Prof. Amardip Ghosh and Mr G. Karmakar", position: "" },
  //     ],
  //   },
  //   {
  //     title: "FOOD COMMITTEE",
  //     members: [
  //       {
  //         name: "Prof. R. Joarder, Prof. M. Kaushik and Mr. S. Sikdar",
  //         position: "",
  //       },
  //     ],
  //   },
  //   {
  //     title: "RECEPTION DESK",
  //     members: [{ name: "Prof. A. Prakash, and Mr. B Maiti", position: "" }],
  //   },
  //   {
  //     title: "COMPUTER, AUDIO VISUALS",
  //     members: [{ name: "Mr. R. Nandi", position: "" }],
  //   },
  //   {
  //     title: "OFFICE AND POSTAL WORK AND REIMBURSEMENTS",
  //     members: [{ name: "Mr. S. Santra and Mr. U. Sarkar", position: "" }],
  //   },
  // ];
  
const committeeData = [];

  // Function to render member card with different colors based on index
  const getMemberCardColor = (index) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-indigo-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-red-500 to-orange-600",
      "from-orange-500 to-amber-600",
      "from-emerald-500 to-teal-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1517976547714-720226b864c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Conference <span className="text-yellow-300">Committee</span>
          </h1>
          <div className="w-32 h-1 bg-yellow-300 mb-8"></div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Meet our distinguished team of experts and organizers who are
            working tirelessly to make this aerospace conference a grand success
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,122.7C672,96,768,64,864,74.7C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Committee Sections */}
        {committeeData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="committee-section mb-16">
            <div className="relative mb-10">
              <div className="absolute left-0 top-1/2 w-full h-px bg-gray-200"></div>
              <div className="relative flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                  {sectionIndex + 1}
                </div>
                <h2 className="bg-white ml-4 pl-4 pr-8 text-2xl font-bold text-blue-800 z-10">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Different layout based on committee importance */}
            <div
              className={`grid gap-6 ${
                sectionIndex <= 2
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {section.members.map((member, memberIndex) => (
                <div
                  key={memberIndex}
                  className={`transform transition-all duration-300 ${
                    sectionIndex <= 2
                      ? "hover:-translate-y-2"
                      : "hover:scale-105"
                  }`}
                  style={{
                    transformOrigin: "center",
                  }}
                >
                  <div
                    className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col ${
                      sectionIndex > 2 ? "p-0" : "pb-4"
                    }`}
                  >
                    <div
                      className={`h-2 w-full bg-gradient-to-r ${getMemberCardColor(
                        memberIndex
                      )}`}
                    ></div>
                    <div className="p-4 flex-grow">
                      <h3
                        className={`font-bold text-gray-800 mb-2 ${
                          sectionIndex <= 2 ? "text-lg" : "text-base"
                        }`}
                      >
                        {member.name}
                      </h3>
                      {member.position && (
                        <p className="text-gray-600 mb-1 italic text-sm">
                          {member.position}
                        </p>
                      )}
                    </div>
                    {member.email && (
                      <div className="px-4 pb-2 mt-auto">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {member.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;
