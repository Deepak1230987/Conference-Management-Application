import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Background animation
  useEffect(() => {
    setIsVisible(true);

    // Mark component as loaded after short delay for entrance animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Animate stars in the background
    const createStars = () => {
      const starsContainer = document.querySelector(".stars-container");
      if (!starsContainer) return;

      starsContainer.innerHTML = "";
      const count = window.innerWidth < 768 ? 150 : 300; // Increased star count for more immersive feel

      for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 10}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;

        // Create varied star sizes for more depth
        const size = Math.random() * 3;
        if (size < 0.8) {
          star.style.width = "1px";
          star.style.height = "1px";
          star.style.opacity = "0.6";
        } else if (size < 1.8) {
          star.style.width = "1.5px";
          star.style.height = "1.5px";
          star.style.opacity = "0.8";
        } else {
          star.style.width = "2px";
          star.style.height = "2px";
          star.style.opacity = "1";
        }

        starsContainer.appendChild(star);
      }
    };

    createStars();
    window.addEventListener("resize", createStars);

    // Aerodynamic flow lines animation with improved visuals
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let animationFrameId;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Flow particles
      const particles = [];
      const particleCount = window.innerWidth < 768 ? 60 : 120; // Increased particle count

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 2 + 1.5,
          speedY: Math.random() * 0.4 - 0.2,
          // Enhanced color palette with more vibrant blues
          color: `hsla(${200 + Math.random() * 60}, ${
            80 + Math.random() * 20
          }%, ${65 + Math.random() * 15}%, ${0.4 + Math.random() * 0.3})`,
          length: Math.random() * 10 + 5, // Variable trail length
        });
      }

      // Improved aerodynamic flow animation
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3;

        // Draw flow lines
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);

          // More dynamic curved flow lines
          const cpx = p.x - p.speedX * 2;
          const cpy = p.y - p.speedY * 3;
          ctx.quadraticCurveTo(
            cpx,
            cpy,
            p.x - p.speedX * p.length,
            p.y - p.speedY * p.length
          );

          // Create gradient for more dynamic trail effect
          const gradient = ctx.createLinearGradient(
            p.x,
            p.y,
            p.x - p.speedX * p.length,
            p.y - p.speedY * p.length
          );
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.stroke();

          // Update position with slight variance for more natural flow
          p.x += p.speedX + Math.sin(Date.now() * 0.001 + i) * 0.3;
          p.y += p.speedY + Math.cos(Date.now() * 0.002 + i) * 0.2;

          // Reset if off-screen
          if (p.x > canvas.width) {
            p.x = 0;
            p.y = Math.random() * canvas.height;
            p.color = `hsla(${200 + Math.random() * 60}, ${
              80 + Math.random() * 20
            }%, ${65 + Math.random() * 15}%, ${0.4 + Math.random() * 0.3})`;
          }
        }

        animationFrameId = window.requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("resize", createStars);
      };
    }

    return () => {
      window.removeEventListener("resize", createStars);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-60px)] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Enhanced Stars Background */}
      <div className="stars-container absolute inset-0 z-0 opacity-70"></div>

      {/* Enhanced Aerodynamic Flow Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 opacity-40"
      ></canvas>

      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-indigo-600/10 blur-[80px] animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Aerospace-themed visual elements */}
      <div className="absolute top-10 left-10 z-5">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          className="opacity-25"
        >
          <path
            d="M75,15 L85,55 L125,75 L85,95 L75,135 L65,95 L25,75 L65,55 Z"
            fill="none"
            stroke="rgba(56, 189, 248, 0.8)"
            strokeWidth="2"
            className="animate-spin-slow"
          />
          <circle
            cx="75"
            cy="75"
            r="50"
            fill="none"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
            strokeDasharray="10 5"
            className="animate-reverse-spin-slow"
          />
        </svg>
      </div>

      <div className="absolute right-20 top-1/4 z-5">
        <svg
          width="180"
          height="100"
          viewBox="0 0 180 100"
          className="opacity-25"
        >
          <path
            d="M10,50 C40,10 140,10 170,50 C140,90 40,90 10,50 Z"
            fill="none"
            stroke="rgba(124, 58, 237, 0.7)"
            strokeWidth="2"
            className="animate-pulse"
          />
          <path
            d="M40,50 C60,25 120,25 140,50 C120,75 60,75 40,50 Z"
            fill="none"
            stroke="rgba(124, 58, 237, 0.4)"
            strokeWidth="1"
          />
          <line
            x1="10"
            y1="50"
            x2="170"
            y2="50"
            stroke="rgba(124, 58, 237, 0.3)"
            strokeWidth="1"
            strokeDasharray="5 5"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 left-1/3 z-5">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="opacity-25"
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(251, 113, 133, 0.4)"
            strokeWidth="1"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="50"
            ry="30"
            fill="none"
            stroke="rgba(251, 113, 133, 0.7)"
            strokeWidth="2"
            className="animate-float-slow"
          />
          <line
            x1="10"
            y1="60"
            x2="110"
            y2="60"
            stroke="rgba(251, 113, 133, 0.3)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </svg>
      </div>

      {/* Enhanced Animated Icons */}
      <div
        className={`absolute z-20 top-[15%] right-[20%] transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "0.3s",
          animation: "float 8s ease-in-out infinite",
        }}
      >
        <div className="relative p-3 rounded-full bg-cyan-500/10 backdrop-blur-sm">
          <i className="ri-radar-line text-5xl md:text-6xl text-cyan-400 opacity-90 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]"></i>
        </div>
      </div>

      <div
        className={`absolute z-20 bottom-[25%] left-[15%] transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "0.6s",
          animation: "float 7s ease-in-out infinite",
        }}
      >
        <div className="relative p-3 rounded-full bg-purple-500/10 backdrop-blur-sm">
          <i className="ri-space-ship-line text-5xl md:text-6xl text-purple-400 opacity-90 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"></i>
        </div>
      </div>

      <div
        className={`absolute z-20 top-[35%] left-[10%] transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "0.8s",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        <div className="relative p-3 rounded-full bg-blue-500/10 backdrop-blur-sm">
          <i className="ri-microscope-line text-5xl md:text-6xl text-blue-400 opacity-90 drop-shadow-[0_0_12px_rgba(96,165,250,0.7)]"></i>
        </div>
      </div>

      <div
        className={`absolute right-[8%] bottom-[20%] z-20 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "0.5s",
          animation: "float 5s ease-in-out infinite",
        }}
      >
        <div className="relative p-3 rounded-full bg-sky-500/10 backdrop-blur-sm">
          <i className="ri-plane-line text-6xl md:text-7xl text-sky-400 opacity-90 drop-shadow-[0_0_12px_rgba(14,165,233,0.7)]"></i>
        </div>
      </div>

      <div
        className={`absolute left-[20%] top-[15%] z-20 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "0.7s",
          animation: "spin 20s linear infinite",
        }}
      >
        <div className="relative p-3 rounded-full bg-indigo-500/10 backdrop-blur-sm">
          <i className="ri-orbit-line text-5xl md:text-6xl text-indigo-400 opacity-90 drop-shadow-[0_0_12px_rgba(129,140,248,0.7)]"></i>
        </div>
      </div>

      <div
        className={`absolute right-[25%] bottom-[15%] z-20 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.9s", animation: "pulse 3s infinite" }}
      >
        <div className="relative p-3 rounded-full bg-rose-500/10 backdrop-blur-sm">
          <i className="ri-rocket-line text-5xl md:text-6xl text-rose-400 opacity-90 drop-shadow-[0_0_12px_rgba(251,113,133,0.7)]"></i>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 z-30 relative">
        <div
          className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-0 items-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left Column - Main Conference Info */}
          <div className="order-2 md:order-1">
            <div className="backdrop-blur-xl bg-white/10 p-8 md:p-10 rounded-2xl border border-white/20 shadow-[0_10px_40px_rgb(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(14,165,233,0.35)] transition-all duration-500">
              <div className="inline-block text-base md:text-lg font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-700 text-white px-7 py-2 rounded-full mb-4 shadow-xl animate-pulse-slow border-2 border-cyan-300/60 ring-4 ring-blue-400/30 ring-offset-2 ring-offset-slate-900 relative date-badge-glow">
                December 15-17, 2025
                <span className="absolute inset-0 rounded-full pointer-events-none date-badge-glow-inner"></span>
              </div>

              {/* Extended Deadline Announcement */}
              {/* <div className="mb-6 relative">
                <div className="inline-flex items-center w-fit gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg border border-amber-300/50 ">
                  <i className="ri-time-line text-lg"></i>
                  <span>
                    Extended! Abstract submission deadline: October 15, 2025
                  </span>
                  <div className="absolute -top-1 -right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div> */}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text relative">
                  ICTACEM
                  <div className="absolute -inset-1 blur-xl bg-blue-400/20 -z-10 rounded-lg"></div>
                </span>
                <span className="text-white">-2025</span>
              </h1>

              <div className="mb-6">
                <p className="text-xl md:text-2xl font-light text-blue-100">
                  International Conference on Theoretical Applied Computational
                  and Experimental Mechanics
                </p>
              </div>

              <p className="text-md text-blue-200 mb-6 backdrop-blur-sm bg-black/10 p-3 rounded-lg inline-block">
                <i className="ri-map-pin-line mr-1"></i>
                Vikramshila Complex, Indian Institute of Technology Kharagpur
                <br />
                Kharagpur, West Bengal, India. Pin – 721 302
              </p>

              {/* Publication Announcement */}
              <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <i className="ri-book-open-line text-2xl text-emerald-400"></i>
                  </div>
                  <div className="text-sm text-emerald-100 leading-relaxed">
                    <strong className="text-emerald-300">
                      Publication Opportunity:
                    </strong>{" "}
                    We are pleased to announce that selected full-length papers
                    will be published by a renowned publishing house, continuing
                    the standard established with our{" "} 
                    <a
                      href="https://doi.org/10.1201/9781003324539"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 decoration-emerald-400/60 hover:decoration-emerald-300 transition-colors font-medium"
                    >
                      ICTACEM-2021 conference proceedings 
                      
                    </a>
                    The accepted Extended Abstracts will be compiled and published in a Book of Abstracts, with an official ISBN.
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-start gap-4">
                <button
                  onClick={() => navigate("/registration")}
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 px-8 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.7)] hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <i className="ri-user-add-line group-hover:rotate-12 transition-transform"></i>
                  Sign Up Now
                </button>
                <button
                  onClick={() => navigate("/submit")}
                  className="group bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 py-4 px-8 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <i className="ri-file-paper-2-line group-hover:rotate-12 transition-transform"></i>
                  Submit Extended Abstract/Paper
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Element */}
          <div className="order-1 md:order-2 flex justify-center">
            <div
              className={`relative w-full max-w-md aspect-square transition-all duration-1000 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Orbital rings with enhanced glow effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-4 border-t-sky-400/70 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 rounded-full border-4 border-r-cyan-400/70 border-l-transparent border-t-transparent border-b-transparent animate-spin-reverse-slow shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/5 h-3/5 rounded-full border-4 border-b-blue-400/70 border-t-transparent border-r-transparent border-l-transparent animate-spin-slow shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/5 h-2/5 rounded-full border-4 border-l-indigo-400/70 border-t-transparent border-r-transparent border-b-transparent animate-spin-reverse-slow shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
              </div>

              {/* Enhanced central aerospace icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 rounded-full bg-gradient-to-br from-slate-900/80 to-blue-900/80 backdrop-blur-xl border-2 border-white/20 shadow-[0_0_40px_rgba(14,165,233,0.5)]">
                  <i className="ri-space-shuttle-line text-8xl md:text-9xl text-white opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></i>
                </div>
              </div>

              {/* Enhanced pulse effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-transparent border border-cyan-500/30 animate-ping-slow opacity-0"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-full h-full rounded-full bg-transparent border border-blue-500/20 animate-ping-slow opacity-0"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .date-badge-glow {
          box-shadow: 0 0 24px 6px rgba(34, 211, 238, 0.25),
            0 2px 16px 0 rgba(59, 130, 246, 0.18);
          position: relative;
          z-index: 2;
        }
        .date-badge-glow-inner {
          box-shadow: 0 0 16px 4px rgba(34, 211, 238, 0.15),
            0 0 0 4px rgba(59, 130, 246, 0.07);
          opacity: 0.4;
          z-index: 1;
          pointer-events: none;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
