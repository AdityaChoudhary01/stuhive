"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Upload, Download, FolderHeart, PenTool, ShieldCheck, Trophy, ArrowRight, Sparkles } from "lucide-react";

export default function HivePointsClient() {
  const earningMethods = [
    {
      title: "Publish a Blog",
      points: "+20",
      desc: "Write a helpful peer story, exam guide, or study technique.",
      icon: <PenTool className="w-6 h-6 text-purple-400" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      link: "/blogs/post",
      actionText: "Write Blog"
    },
    {
      title: "Create a Bundle",
      points: "+15",
      desc: "Organize existing notes into a highly searchable university collection.",
      icon: <FolderHeart className="w-6 h-6 text-cyan-400" />,
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
      link: "/profile",
      actionText: "Create Archive"
    },
    {
      title: "Upload Notes",
      points: "+10",
      desc: "Share a high-quality PDF, handwritten note, or previous year paper.",
      icon: <Upload className="w-6 h-6 text-green-400" />,
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
      link: "/notes/upload",
      actionText: "Upload Now"
    },
    {
      title: "Get Downloads",
      points: "+2",
      desc: "Earn passive points every single time a student downloads your uploaded notes.",
      icon: <Download className="w-6 h-6 text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
      link: "/search",
      actionText: "See Notes"
    },
  ];

  return (
    <div className="container max-w-5xl py-16 md:py-24 px-4 sm:px-6 relative z-10 animate-in fade-in duration-700">
      
      {/* --- HERO SECTION --- */}
      <div className="text-center mb-16 sm:mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-amber-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-amber-500/10 rounded-2xl sm:rounded-3xl border border-amber-500/20 text-amber-400 mb-6 sm:mb-8 shadow-[0_0_40px_rgba(245,158,11,0.2)] animate-bounce-slow">
          <Star size={40} className="sm:w-16 sm:h-16 fill-amber-400" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Hive Points</span> Engine
        </h1>
        
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Goodwill is great, but recognition is better. Earn reputation points for contributing to the community and secure your spot on the University Leaderboards.
        </p>
      </div>

      {/* --- HOW TO EARN GRID --- */}
      <div className="mb-20 sm:mb-32">
        <div className="flex items-center gap-3 mb-8 pl-1">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">How to Earn Points</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {earningMethods.map((method, idx) => (
            <div key={idx} className={`group relative flex flex-col justify-between p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 ${method.glow}`}>
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-xl sm:rounded-2xl ${method.bg} border ${method.border}`}>
                    {method.icon}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-black text-amber-400 text-sm">{method.points}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{method.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">{method.desc}</p>
              </div>
              
              <Link href={method.link} className="mt-auto">
                <Button variant="outline" className="w-full rounded-full h-12 font-bold bg-transparent border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  {method.actionText} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* --- RANKS & BADGES --- */}
      <div className="relative p-8 sm:p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Unlock Elite Badges</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0">
              As you cross specific point thresholds, your profile will automatically unlock verifiable badges. Stand out to your peers and prove you are the ultimate academic resource.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
               <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
                 <ShieldCheck className="w-6 h-6 text-blue-400" />
                 <div className="text-left">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tier 1</p>
                   <p className="text-sm font-bold text-white">Verified Contributor</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-2xl border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                 <Trophy className="w-6 h-6 text-yellow-400" />
                 <div className="text-left">
                   <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Top Tier</p>
                   <p className="text-sm font-bold text-white">StuHive Star</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <Link href="/">
              <Button className="w-full md:w-auto h-14 px-10 rounded-full font-black text-sm uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95">
                Go to Hall of Fame
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}