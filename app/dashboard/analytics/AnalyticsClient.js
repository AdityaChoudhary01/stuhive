"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { Eye, Download, TrendingUp, Sparkles } from "lucide-react";

export default function AnalyticsClient({ rawData }) {
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30

  // 🚀 FILL IN MISSING DAYS: If a user gets 0 views on a Tuesday, we still need 
  // that date on the graph so the line doesn't skip!
  const chartData = useMemo(() => {
    const dataMap = new Map(rawData.map(item => [item.date, item]));
    const filledData = [];
    
    // Loop backwards from today
    for (let i = timeRange - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = d.toISOString().split('T')[0];
      
      filledData.push({
        date: format(d, 'MMM dd'), // e.g., "Feb 26"
        views: dataMap.get(dateStr)?.views || 0,
        downloads: dataMap.get(dateStr)?.downloads || 0,
      });
    }
    return filledData;
  }, [rawData, timeRange]);

  // Calculate Totals
  const totalViews = chartData.reduce((sum, item) => sum + item.views, 0);
  const totalDownloads = chartData.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Creator Analytics <Sparkles className="text-cyan-400 w-6 h-6" />
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Track the impact of your study materials across the network.</p>
        </div>

        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value={7} className="bg-black">Last 7 Days</option>
          <option value={14} className="bg-black">Last 14 Days</option>
          <option value={30} className="bg-black">Last 30 Days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 blur-[40px] group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center gap-3 text-cyan-400 mb-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg"><Eye size={20} /></div>
            <span className="font-bold uppercase tracking-widest text-xs">Total Views</span>
          </div>
          <p className="text-4xl sm:text-5xl font-black text-white">{totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 blur-[40px] group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg"><Download size={20} /></div>
            <span className="font-bold uppercase tracking-widest text-xs">Total Downloads</span>
          </div>
          <p className="text-4xl sm:text-5xl font-black text-white">{totalDownloads.toLocaleString()}</p>
        </div>
      </div>

      {/* Recharts Graph */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 sm:p-8 pt-10 h-[400px] sm:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Beautiful Gradients for the Area chart */}
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickMargin={10} minTickGap={20} />
            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '12px', fontWeight: 'bold' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#888', marginBottom: '4px' }}
            />

            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#22d3ee" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              name="Views"
            />
            <Area 
              type="monotone" 
              dataKey="downloads" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDownloads)" 
              name="Downloads"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}