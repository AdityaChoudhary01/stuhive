"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaBolt, FaStar, FaRocket, FaArrowRight, FaFeatherAlt } from "react-icons/fa";

export default function HeroSection() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [fade, setFade] = useState(true);

  const activities = useMemo(
    () => [
      { user: "Aditya", action: "uploaded React Notes", icon: <FaBolt aria-hidden="true" className="text-amber-400" /> },
      { user: "Sneha", action: "shared DBMS PDF", icon: <FaStar aria-hidden="true" className="text-cyan-400" /> },
      { user: "Rahul", action: "joined StuHive", icon: <FaRocket aria-hidden="true" className="text-purple-400" /> },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [activities.length]);

  return (
    <section
      className="relative w-full pt-10 pb-20 md:pt-6 md:pb-30 flex flex-col items-center justify-center overflow-hidden"
      aria-label="Welcome to StuHive Educational Network"
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      {/* --- SUBTLE AMBIENT GLOWS --- */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      {/* subtle premium grid/noise overlay (transparent only) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(60% 60% at 50% 35%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 35%, black 55%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="text-center z-10 max-w-5xl px-4 sm:px-6">
        {/* Live Activity Badge */}
        <div className="mx-auto w-fit mb-8" aria-hidden="true">
          <div
            className="group relative inline-flex items-center gap-3
              bg-white/[0.02] backdrop-blur-md border border-white/5
              rounded-full px-4 py-2 sm:px-5 sm:py-2.5 overflow-hidden
              shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]
              transition-all duration-300 hover:border-white/10 hover:bg-white/[0.035]"
          >
            {/* sheen */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(700px_circle_at_30%_20%,rgba(34,211,238,0.14),transparent_45%)]" />

            <div className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </div>

            <div
              className={`relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em]
                text-gray-300 flex items-center gap-2 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
            >
              {activities[currentActivity].icon}
              <span className="truncate max-w-[200px] sm:max-w-none">
                <strong className="text-white">{activities[currentActivity].user}</strong> {activities[currentActivity].action}
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 sm:mb-8 leading-[1.06] tracking-tight drop-shadow-lg" itemProp="headline">
          Master Your Coursework <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 pb-2 inline-block">
            with StuHive
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-medium px-2" itemProp="description">
          The decentralized archive for high-performing university students. <br className="hidden md:block" />
          <span className="text-white">Download free study materials, share handwritten notes, and conquer exams together.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
          {/* Primary */}
          <Link
            href="/search"
            title="Explore Free Study Materials"
            aria-label="Start Learning and explore academic notes"
            className="group relative px-6 py-3.5 sm:px-8 sm:py-4 w-full sm:w-auto rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-cyan-500 to-purple-600 text-white
              font-black text-sm sm:text-base overflow-hidden
              transition-all duration-300 transform-gpu will-change-transform
              hover:scale-[1.02] active:scale-[0.98]
              flex items-center justify-center gap-3
              shadow-[0_25px_70px_-40px_rgba(168,85,247,0.55)] hover:shadow-[0_30px_80px_-45px_rgba(34,211,238,0.45)]
              outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(900px_circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
            <span className="absolute inset-0 -translate-x-full motion-safe:group-hover:animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />

            <FaRocket aria-hidden="true" className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            <span className="relative z-10">Start Learning</span>
            <FaArrowRight aria-hidden="true" size={14} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>

          {/* Secondary */}
          <Link
            href="/notes/upload"
            title="Upload your notes"
            aria-label="Share your own academic notes with the community"
            className="group relative px-6 py-3.5 sm:px-8 sm:py-4 w-full sm:w-auto rounded-xl sm:rounded-2xl
              bg-white/[0.02] backdrop-blur-md border border-white/5
              text-white font-black text-sm sm:text-base
              hover:bg-white/[0.05] hover:border-white/10
              transition-all duration-300 transform-gpu will-change-transform
              hover:scale-[1.02] active:scale-[0.98]
              flex items-center justify-center gap-3 overflow-hidden
              outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
              shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]"
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(900px_circle_at_30%_20%,rgba(34,211,238,0.12),transparent_45%)]" />
            <FaFeatherAlt aria-hidden="true" className="relative z-10 text-cyan-400 transition-transform group-hover:rotate-12" />
            <span className="relative z-10">Share Notes</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
