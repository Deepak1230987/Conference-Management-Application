const PlenarySpeakers = () => {
  const plenarySpeakers = [
    {
      name: "Prof. Abhishek",
      affiliation: "Indian Institute of Technology Kanpur",
      designation: "Professor",
      websiteLink: "https://www.iitk.ac.in/dr-abhishek",
    },
    {
      name: "Prof. J. Kapat",
      affiliation: "University of Central Florida",
      designation: "Professor",
      websiteLink: "https://mae.ucf.edu/person/jayanta-kapat/",
    },
    {
      name: "Prof. Tribikram Kundu",
      affiliation: "University of Arizona",
      designation: "Professor",
      websiteLink:
        "https://caem.engineering.arizona.edu/faculty-staff/faculty/tribikram-kundu",
    },
    {
      name: "Prof. J. C. Mandal",
      affiliation: "Indian Institute of Technology Bombay",
      designation: "Professor",
      websiteLink: "https://www.aero.iitb.ac.in/home/people/faculty/mandal",
    },
    {
      name: "Prof. Abhijit Mukherjee",
      affiliation: "Curtin University, Australia",
      designation: "Professor",
      websiteLink:
        "https://staffportal.curtin.edu.au/staff/profile/view/abhijit-mukherjee-9afc06f5/",
    },
    {
      name: "Prof. P. A. Ramakrishna",
      affiliation: "Indian Institute of Technology Madras",
      designation: "Professor",
      websiteLink: "https://iitm.irins.org/profile/50694",
    },
    {
      name: "Dr. Partha Adhikari",
      affiliation: "Boeing Company",
      designation: "",
      websiteLink: "",
    },
    {
      name: "Dr. Kallappa Pattada",
      affiliation: "Boeing Company",
      designation: "",
      websiteLink: "",
    },
    {
      name: "Prof. Joseph Mathew",
      affiliation: "Indian Institute of Science, Bangalore",
      designation: "Chief Guest",
      websiteLink: "https://aero.iisc.ac.in/people/joseph-mathew/",
    },
  ];

  // sort speakers alphabetically by surname, but keep Chief Guest at top
  const getSurname = (fullName) => {
    const cleaned = fullName.replace(/^(Prof\.|Dr\.)\s*/i, "").trim();
    const parts = cleaned.split(/\s+/);
    return parts[parts.length - 1].toLowerCase();
  };

  const chiefGuest = plenarySpeakers.find(
    (s) => s.designation === "Chief Guest"
  );
  const otherSpeakers = plenarySpeakers.filter(
    (s) => s.designation !== "Chief Guest"
  );
  const sortedOthers = otherSpeakers.sort((a, b) =>
    getSurname(a.name).localeCompare(getSurname(b.name))
  );
  const sortedSpeakers = chiefGuest
    ? [chiefGuest, ...sortedOthers]
    : sortedOthers;

  // Unique color scheme for each speaker
  const getSpeakerStyle = (index) => {
    const styles = [
      {
        bg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
        icon: "🔬",
      },
      {
        bg: "bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600",
        icon: "🏗️",
      },
      {
        bg: "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600",
        icon: "💨",
      },
      {
        bg: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
        icon: "🎯",
      },
      {
        bg: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
        icon: "🔥",
      },
      {
        bg: "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600",
        icon: "⚡",
      },
    ];
    return styles[index % styles.length];
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
              ✨ Plenary Session
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Distinguished <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Plenary Speakers
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            World-renowned experts sharing cutting-edge insights in aerospace
            engineering
          </p>
        </div>
      </div>

      {/* Speakers Grid - Unique Bento Style Layout */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSpeakers.map((speaker, index) => {
              const style = getSpeakerStyle(index);
              const isChiefGuest = speaker.designation === "Chief Guest";

              return (
                <div
                  key={index}
                  className={`group relative ${
                    isChiefGuest ? "lg:col-span-2" : ""
                  }`}
                >
                  {/* Glowing Border Effect */}
                  <div
                    className={`absolute inset-0 ${
                      isChiefGuest
                        ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                        : style.bg
                    } ${
                      isChiefGuest
                        ? "opacity-30 blur-2xl"
                        : "opacity-0 group-hover:opacity-100 blur-lg"
                    } rounded-2xl transition-opacity duration-500 -z-10`}
                  ></div>

                  {/* Card */}
                  <div
                    className={`relative h-full bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl overflow-hidden backdrop-blur-xl border ${
                      isChiefGuest
                        ? "border-yellow-500 shadow-2xl shadow-yellow-500/30"
                        : "border-slate-700 group-hover:border-slate-500"
                    } transition-all duration-500 shadow-2xl`}
                  >
                    {/* Top Gradient Bar */}
                    <div
                      className={`h-1.5 w-full bg-gradient-to-r ${
                        isChiefGuest
                          ? "from-yellow-400 via-amber-500 to-orange-500"
                          : style.bg
                      }`}
                    ></div>

                    <div className="p-8">
                      {/* Name */}
                      <h3
                        className={`text-2xl font-bold mb-2 transition-all duration-300 ${
                          isChiefGuest
                            ? "text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text"
                            : "text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text"
                        }`}
                      >
                        {speaker.name}
                      </h3>

                      {/* Designation */}
                      {speaker.designation && (
                        <p
                          className={`text-sm font-semibold mb-4 ${
                            isChiefGuest ? "text-yellow-300" : "text-cyan-300"
                          }`}
                        >
                          {speaker.designation}
                        </p>
                      )}

                      {/* Affiliation */}
                      {speaker.affiliation && (
                        <div className="flex items-start gap-2 pt-4 border-t border-slate-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
                          </svg>
                          <p className="text-sm text-gray-200 font-medium">
                            {speaker.affiliation}
                          </p>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="mt-6 pt-4 border-t border-slate-600">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            isChiefGuest
                              ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/50 animate-pulse"
                              : `bg-gradient-to-r ${style.bg} text-white`
                          }`}
                        >
                          {isChiefGuest ? "Chief Guest" : "Plenary Speaker"}
                        </span>
                      </div>

                      {/* Website Link */}
                      {speaker.websiteLink && (
                        <div className="mt-4">
                          <a
                            href={speaker.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Profile
                          </a>
                        </div>
                      )}
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
      </div>

      {/* About Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Plenary Speakers
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto"></div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-0.5">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8">
              <p className="text-gray-100 text-lg leading-relaxed">
                Our plenary speakers bring decades of combined experience in
                aerospace research, development, and innovation. They will
                present groundbreaking research findings and provide valuable
                perspectives on the future of aerospace engineering, including
                aerodynamics, propulsion systems, structural analysis, flight
                dynamics, and advanced materials. Join us for inspiring
                presentations that will shape the future of aerospace
                technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlenarySpeakers;
