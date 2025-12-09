import React from "react";

const Committee = () => {
  // Committee data organized by sections

  const committeeData = [
    {
      title: "Patrons",
      members: [
        {
          name: "Prof. Suman Chakraborty",
          position: "Director, IIT Kharagpur",
        },
      ],
    },
    {
      title: "Organizing Committee",
      members: [
        {
          name: "Prof. Akshay Prakash",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Amardip Ghosh",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Anup Ghosh",
          position:
            "Co-Convenor, Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Arnab Roy",
          position:
            "Convenor, HOD, Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. B. N. Singh",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. C. S. Mistry",
          position: " Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. D. K. Maiti",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. K. P. Sinhamahapatra",
          position:
            "Mentor, Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. M. R. Sunny",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },

        {
          name: "Prof. M. Sinha",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Mira Mitra",
          position:
            "Co-Convenor, Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Mrinal Kaushik",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. N. K. Peyada",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Prasun Jana",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Ratan Joarder",
          position:
            "Treasurer, Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. S. C. Pradhan",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Sandeep Saha",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Sikha Hota",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Somnath Ghosh",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Srinibas Karmakar",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Sunil Manohar Dash",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Susmita Bhattacharyya",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
      ],
    },
    {
      title: "Technical Committee",
      members: [
        {
          name: "Prof. N. K. Peyada",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Prasun Jana",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. Ratan Joarder",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
        {
          name: "Prof. S. M. Dash",
          position: "Department of Aerospace Engineering, IIT Kharagpur",
        },
      ],
    },
    {
      title: "Advisory Committee",
      members: [
        {
          name: "Prof. A K Ghosh",
          position: "TATA Advanced Systems Limited",
        },
        {
          name: "Prof. Abhay Anant Pashilkar",
          position: "National Aerospace Laboratories",
        },
        {
          name: "Prof. Abhijit Kushari",
          position: "Indian Institute of Technology Kanpur",
        },
        {
          name: "Prof. Avijit Chatterjee",
          position: "Indian Institute of Technology Bombay",
        },
        {
          name: "Prof. Debopam Das",
          position: "Indian Institute of Technology Kanpur",
        },
        {
          name: "Prof. Ernesto Benini",
          position: "University of Padova",
        },
        {
          name: "Prof. G. Jagadeesh",
          position: "Indian Institute of Science, Bangalore",
        },
        {
          name: "Prof. H. S. N. Murthy",
          position: "Indian Institute of Technology Madras",
        },
        {
          name: "Prof. Jayanta S. Kapat",
          position: "University of Central Florida",
        },
        {
          name: "Prof. Nandan K. Sinha",
          position: "Indian Institute of Technology Madras",
        },
        {
          name: "Prof. Radhakant Padhi",
          position: "Indian Institute of Science, Bangalore",
        },
        {
          name: "Prof. Rakesh K. Kapania",
          position: "Virginia tech, USA",
        },
        {
          name: "Prof. Raktim Bhattacharyya",
          position: "Texas A&M University, USA",
        },
        {
          name: "Prof. Samit Roy",
          position: "University of Alabama",
        },
        {
          name: "Prof. Santosh Kapuria",
          position: "Indian Institute of Technology Delhi",
        },
        {
          name: "Prof. Sudarsan Kumar",
          position: "Indian Institute of Technology Bombay",
        },
        {
          name: "Prof. Sunetra Sarkar",
          position: "Indian Institute of Technology Madras",
        },
        {
          name: "Prof. Tribikram Kundu",
          position: "University of Arizona, USA",
        },
      ],
    },
  ];
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
  //
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

  //  Function to render member card with different colors based on index
  const getMemberCardColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
      "bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600",
      "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600",
      "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
      "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
      "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full animate-pulse"></div>
        
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white">
              👥 Conference Team
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Meet Our <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Committee
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Distinguished experts and organizers working together for an
            outstanding conference
          </p>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Committee Sections */}
          {committeeData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-20">
              {/* Section Header */}
              <div className="relative mb-12">
                <div className="absolute left-0 top-1/2 w-full h-px bg-slate-700"></div>
                <div className="relative flex items-center">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl z-10">
                    {sectionIndex + 1}
                  </div>
                  <h2 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ml-4 pl-4 pr-8 text-3xl font-bold text-white z-10">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.members.map((member, memberIndex) => {
                  const color = getMemberCardColor(memberIndex);
                  return (
                    <div key={memberIndex} className="group relative">
                      {/* Glowing Border Effect */}
                      <div
                        className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-100 blur-lg rounded-2xl transition-opacity duration-500 -z-10`}
                      ></div>

                      {/* Card */}
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl overflow-hidden backdrop-blur-xl border border-slate-700 group-hover:border-slate-500 transition-all duration-500 shadow-2xl p-6">
                        {/* Top Gradient Bar */}
                        <div
                          className={`h-1.5 w-full bg-gradient-to-r ${color} absolute top-0 left-0 right-0`}
                        ></div>

                        <div className="mt-2">
                          {/* Name */}
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                            {member.name}
                          </h3>

                          {/* Position */}
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {member.position}
                          </p>

                        </div>

                        {/* Hover Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-10"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Committee;
