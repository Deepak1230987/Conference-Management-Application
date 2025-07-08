import React, { useEffect, useRef } from "react";
import HeroSection from "../components/HeroSection";
import { motion } from "framer-motion";

const Home = () => {
  // Ref for intersection observer
  const sectionRefs = {
    about: useRef(null),
    themes: useRef(null),
    apcats: useRef(null),
    ajsae: useRef(null),
    aesi: useRef(null),
    campus: useRef(null),
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Setup intersection observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-50px",
    };

    const observers = [];

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      }, observerOptions);

      if (ref.current) {
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden  bg-gradient-to-b from-white via-gray-100 to-blue-50">
      {/* Hero Section - Full-width */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-16">
        {/* About The Conference */}
        <motion.section
          ref={sectionRefs.about}
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <div className="relative">
            <div className="absolute -left-4 top-0 h-16 w-1 bg-blue-600 transform -skew-x-12"></div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 pl-6">
              About The Conference
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-600 hover:transform hover:scale-[1.01] transition-transform duration-300">
            <motion.p
              className="text-lg text-gray-700 leading-relaxed"
              variants={fadeInUp}
            >
              The International Conference on Theoretical Applied Computational
              and Experimental Mechanics is organized every three years by the
              Department of Aerospace Engineering IIT Kharagpur. The conference
              is devoted to providing a platform for scientists and engineers to
              exchange their views on the latest developments in Mechanics since
              1998. ICTACEM Conference is aimed at bringing together
              academicians and researchers working in various disciplines of
              mechanics to exchange views as well as to share knowledge between
              people from different parts of the globe. The 8th ICTACEM will be
              held from December 15-17, 2025 at the Indian Institute of Technology,
              Kharagpur.
            </motion.p>
          </div>
        </motion.section>

        {/* Themes */}
        <motion.section
          ref={sectionRefs.themes}
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <div className="relative">
            <div className="absolute -left-4 top-0 h-16 w-1 bg-blue-600 transform -skew-x-12"></div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 pl-6">
              Conference Themes
            </h2>
          </div>
          <p className="text-lg text-gray-800 mb-8">
            The conference is focused on current research trends in all
            disciplines of mechanics including interdisciplinary areas. The
            topics include (but not limited to):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="theme-card bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-600 p-3 mr-4">
                  <i className="ri-wind-line text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Aerodymanics and Fluid Mechanics
                </h3>
              </div>
              <p className="text-gray-700">
                Experimental and Computational Aerodynamics, Experimental and
                Computational Fluid Mechanics, Seepage Flow, Computational
                Mechanics, Computational Methods, Shock-Boundary Layer
                Interactions, Active and Passive Flow Controls, Fluid-structure
                interaction, High Enthalpy Flows and Hypersonic Aerodynamics,
                biomechanics, Bio-inspired mechanics, Aeroacoustics,
                Hydrodynamics, Turbulence, LES etc.
              </p>
            </motion.div>

            <motion.div
              className="theme-card bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-indigo-600 p-3 mr-4">
                  <i className="ri-building-line text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Solid Mechanics and Dynamics
                </h3>
              </div>
              <p className="text-gray-700">
                AI and Expert Systems, Classical Mechanics, Composite Materials
                and Structure, Computational Mechanics, Computational Methods,
                Damage Mechanics, Fracture Mechanics, Functionally Graded
                Materials, Fuzzy Logic, Genetic Algorithms and Neural Networks,
                Modelling and Simulation, Nano mechanics, Nonlinear Mechanics,
                Optimization, Smart Materials, Structures and Systems,
                Structural Dynamics, Aeroelesticity, Terramechanics, Uncertainty
                Quantification etc.
              </p>
            </motion.div>

            <motion.div
              className="theme-card bg-gradient-to-br from-cyan-50 to-teal-100 rounded-lg shadow-lg p-6 border-l-4 border-cyan-500 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-cyan-600 p-3 mr-4">
                  <i className="ri-flight-takeoff-line text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Flight Mechanics, Control and Navigation
                </h3>
              </div>
              <p className="text-gray-700">
                Space/Orbital Mechanics, UAV, MAV, AI and Expert Systems, Fuzzy
                Logic, Genetic Algorithms and Neural Networks, Satellite-Based
                Navigation Systems, Optimal, Non-linear and Robust control.
              </p>
            </motion.div>

            <motion.div
              className="theme-card bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-orange-600 p-3 mr-4">
                  <i className="ri-rocket-2-line text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Propulsion and Combustion
                </h3>
              </div>
              <p className="text-gray-700">
                Turbomachinery, Aerodynamics of gas turbine components,
                Development and Testing of Gas Turbine Systems, Heat transfer,
                Gas turbine blade cooling, rotor dynamics, Performance Analysis
                and Advanced Cycles, Droplet and spray combustion, Laser
                ignition, Combustion spectroscopy, LES of combustion,
                Alternative fuels, Non-conventional energy, Nano-fuels,
                Technology Development in Solid/Liquid/Hybrid Rockets, etc
                Statistical Thermodynamics, Uncertainty Quantification.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Partners
        <motion.section
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <div className="relative">
            <div className="absolute -left-4 top-0 h-16 w-1 bg-blue-600 transform -skew-x-12"></div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 pl-6">
              Conference Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              ref={sectionRefs.apcats}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-global-line text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                About APCATS
              </h3>
              <p className="text-gray-700">
                The APCATS is held every two years aimed at discussing the
                latest developments in aerospace technology and science. The
                conference provides a platform for scientists and engineers to
                discuss state-of-the-art ideas, methods, and results, in order
                to promote the exchanges and collaborations between different
                disciplines and nations, especially in Asian-Pacific area.
              </p>
            </motion.div>

            <motion.div
              ref={sectionRefs.ajsae}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-book-open-line text-3xl text-indigo-600"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                About AJSAE
              </h3>
              <p className="text-gray-700">
                The AJSAE is held every year and provides an opportunity for
                scientists and engineers to discuss the state-of-art ideas,
                methods, and results in aerospace science and technology, and to
                promote the exchanges and collaborations between different
                disciplines and nations, especially in Asian area.
              </p>
            </motion.div>

            <motion.div
              ref={sectionRefs.aesi}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-building-4-line text-3xl text-sky-600"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                About AeSI
              </h3>
              <p className="text-gray-700">
                Aeronautical Society of India (AeSI) was founded on November 17,
                1948 by Pandit Jawaharlal Nehru, the first Prime Minister of
                India who then became the first Chief Patron of the Society. The
                main motto of AeSI is to promote the advancement and
                dissemination of knowledge of Aeronautical and Aerospace
                Science/Technology and also to strive for the elevation of
                Aeronautical and Aerospace professions.
              </p>
            </motion.div>
          </div>
        </motion.section> */}

        {/* About IIT Kharagpur Campus */}
        <motion.section
          ref={sectionRefs.campus}
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <div className="relative">
            <div className="absolute -left-4 top-0 h-16 w-1 bg-blue-600 transform -skew-x-12"></div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 pl-6">
              About IIT Kharagpur Campus
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 transform -translate-x-16 translate-y-16"></div>

            <div className="relative z-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Kharagpur - a town in eastern India, famous until 1950 as home
                to the longest railway platform in the world - became the
                nursery where the seed of the IIT system was planted in 1951.
                IIT Kharagpur started its journey in the old Hijli Detention
                Camp once where some of the country's great freedom fighters
                were held by the colonial government.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Spurred by the success of IIT Kharagpur, four younger IITs came
                up around the country in the two following decades, and from
                these five came thousands of IITians, the brand ambassadors of
                modern India. It was the success of this one institution at
                Kharagpur that wrote India's technological odyssey.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                The Institute takes pride in its relentless effort to provide
                the best platform for both education as well as research in the
                areas of science and technology, infrastructure design,
                entrepreneurship, law, management, and medical science and
                technology. IIT Kharagpur is not just the place to study
                technology, it is the place where students are taught to dream
                about the future of technology and be innovative and to strive
                to make the world a better place.
              </p>

              <a
                href="https://www.iitkgp.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 group"
              >
                Know More
                <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        {/* <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 text-white text-center shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Us at ICTACEM-2025
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Be part of this prestigious international conference and connect
            with the leading minds in aerospace engineering and mechanics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/ictacem2025/registration"
              className="px-8 py-4 bg-white text-blue-600 hover:text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
            >
              <i className="ri-user-add-line mr-2"></i> Sign Up Now
            </a>
            <a
              href="/ictacem2025/registration"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <i className="ri-file-upload-line mr-2"></i> Submit Papers
            </a>
          </div>
        </motion.section> */}
      </div>

      
    </div>
  );
};

export default Home;
