import React from "react";

const Speakers = () => {
  // const speakersList = [
  //   { name: "Prof. Sharath Girimaji", affiliation: "TAMU, USA" },
  //   { name: "Prof. Raktim Battacharya", affiliation: "TAMU, USA" },
  //   {
  //     name: "Prof. Changduk Kong",
  //     affiliation:
  //       "Emeritus Professor, Department of Aerospace Engineering, Chosun University",
  //   },
  //   {
  //     name: "Dr. Chin-Young Hwang",
  //     affiliation:
  //       "Principal Researcher, KARI, Korea Aerospace Research Institute",
  //   },
  //   { name: "Prof. Tsai", affiliation: "Taiwan" },
  //   { name: "Prof. Mahir Dursun", affiliation: "Gazi Universit, Turkey" },
  //   { name: "Prof. Zhenxun Gao", affiliation: "China" },
  //   { name: "Prof. Shenyan Chen", affiliation: "Beihang University, Beijing" },
  //   { name: "Prof. Saptarshi Basu", affiliation: "IISc Bengaluru" },
  //   { name: "Prof. A. Kushari", affiliation: "IIT Kanpur" },
  //   { name: "Dr. K. S. Parikh", affiliation: "ISRO SAC, Ahmedabad" },
  //   { name: "Prof. A. K. Ghosh", affiliation: "IIT Kanpur" },
  //   { name: "Prof. Krishnendu Sinha", affiliation: "IIT Bombay" },
  //   { name: "Prof. S Kumar", affiliation: "IIT Bombay" },
  // ];

  const speakersList = [];

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Invited Speakers
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We are honored to host these distinguished speakers who are leaders
            in aerospace engineering and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakersList.map((speaker, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex  gap-2 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {speaker.name}
                    </h3>
                    <p className="text-blue-600">{speaker.affiliation}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Keynote Speaker
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Speakers;
