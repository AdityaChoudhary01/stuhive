"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListFilter } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Recently Added", value: "newest" },
  { label: "Most Downloaded", value: "mostDownloaded" },
  { label: "Highest Rated", value: "highestRated" },
  { label: "Most Viewed", value: "mostViewed" },
];

export default function NoteSortBar({ currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
        <ListFilter size={12} className="text-cyan-400" />
        Sort By:
      </div>
      
      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
              currentSort === option.value
                ? "bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}