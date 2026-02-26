"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { Eye, Download, FileText, Globe, TrendingUp, BarChart3, Target } from "lucide-react";
import Link from "next/link";

export default function AdminAnalyticsClient({ data }) {
  // Graceful fallback if data is missing
  const totals = data?.totals || { noteViews: 0, noteDownloads: 0, blogViews: 0, totalSiteVisits: 0 };
  const topViewedNotes = data?.topViewedNotes || [];
  const topDownloadedNotes = data?.topDownloadedNotes || [];
  const topBlogs = data?.topBlogs || [];
  const pageViewsOverTime = data?.pageViewsOverTime || [];
  const topPages = data?.topPages || [];

  // Format dates for the chart
  const chartData = useMemo(() => {
    return pageViewsOverTime.map(d => {
      try {
        return {
          ...d,
          displayDate: format(parseISO(d.date), 'MMM dd')
        };
      } catch (e) {
        return { ...d, displayDate: d.date };
      }
    });
  }, [pageViewsOverTime]);

  return (
    <div className="animate-in fade-in duration-700 pb-10">
      
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <BarChart3 className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8" /> 
            Platform Analytics
          </h2>
          <p className="text-gray-400 mt-1 text-sm font-medium">Real-time macro analytics for the StuHive network.</p>
        </div>
      </header>

      {/* --- MACRO STATS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Site Visits (30d)" value={totals.totalSiteVisits} icon={<Target />} color="text-pink-400" bg="bg-pink-500/10" border="border-pink-500/20" />
        <StatCard title="All-Time Note Views" value={totals.noteViews} icon={<Eye />} color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" />
        <StatCard title="All-Time Note Downloads" value={totals.noteDownloads} icon={<Download />} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        <StatCard title="All-Time Blog Views" value={totals.blogViews} icon={<FileText />} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
      </div>

      {/* --- MAIN TRAFFIC CHART --- */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 mb-8 h-[350px] sm:h-[400px]">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="text-pink-400" /> Traffic Velocity (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="displayDate" stroke="#ffffff40" fontSize={11} tickMargin={10} minTickGap={20} />
            <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '12px' }} 
              itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="views" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- DATA TABLES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Top Pages (Find out which Hubs are popular!) */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="text-cyan-400" /> Most Visited URLs
          </h3>
          <div className="space-y-3">
            {topPages.length > 0 ? topPages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 gap-3">
                <Link href={page.path} target="_blank" className="text-xs sm:text-sm font-medium text-gray-300 hover:text-cyan-400 truncate flex-1 transition-colors">
                  {page.path}
                </Link>
                <span className="font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full text-[10px] sm:text-xs shrink-0">
                  {page.views.toLocaleString()} Views
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No traffic data recorded yet.</p>
            )}
          </div>
        </div>

        {/* Top Notes & Blogs */}
        <div className="space-y-6 sm:space-y-8">
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Download className="text-purple-400" /> Viral Downloads
            </h3>
            <div className="space-y-3">
              {topDownloadedNotes.length > 0 ? topDownloadedNotes.map((note, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{note.title}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">By {note.user?.name || "Unknown"}</p>
                  </div>
                  <span className="font-black text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full text-[10px] sm:text-xs shrink-0 w-fit">
                    {note.downloadCount?.toLocaleString() || 0} DLs
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-4">No downloads recorded yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-amber-400" /> Trending Blogs
            </h3>
            <div className="space-y-3">
              {topBlogs.length > 0 ? topBlogs.map((blog, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{blog.title}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">By {blog.author?.name || "Unknown"}</p>
                  </div>
                  <span className="font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-[10px] sm:text-xs shrink-0 w-fit">
                    {blog.viewCount?.toLocaleString() || 0} Views
                  </span>
                </div>
              )) : (
                 <p className="text-gray-500 text-sm text-center py-4">No blog views recorded yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component for the top metric cards
function StatCard({ title, value, icon, color, bg, border }) {
  return (
    <div className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:${border} transition-colors group relative overflow-hidden flex flex-col justify-between`}>
      <div className={`absolute -right-8 -top-8 w-20 h-20 sm:w-24 sm:h-24 ${bg} blur-[30px] group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
      <div className={`p-2 sm:p-3 rounded-xl w-fit ${bg} ${color} mb-3 sm:mb-4 border ${border}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
          {value?.toLocaleString() || 0}
        </p>
        <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 sm:mt-2 line-clamp-1">{title}</p>
      </div>
    </div>
  )
}