"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button"; 
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ currentPage, totalPages }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  // ✅ Helper to generate the SEO-friendly URL while preserving other filters
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Logic to show limited page numbers (e.g., 1, 2, ..., 8, 9, 10)
  const getVisiblePages = () => {
    const delta = 2; // Pages to show before and after current page
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    range.unshift(1); // Always show first page
    if (totalPages > 1) range.push(totalPages); // Always show last page

    return range;
  };

  const pages = getVisiblePages();

  return (
    <nav 
      className="flex items-center justify-center gap-3 sm:gap-4 py-4" 
      aria-label="Pagination Navigation" // ✅ SEO & A11y
    >
      {/* --- PREVIOUS PAGE LINK --- */}
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          rel="prev" // ✅ SEO: Tells Google this is the previous logical page
          className={cn(buttonVariants({ variant: "outline" }), "gap-1 sm:gap-2 rounded-full px-3 sm:px-4")}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <div className={cn(buttonVariants({ variant: "outline" }), "gap-1 sm:gap-2 rounded-full px-3 sm:px-4 opacity-50 cursor-not-allowed")}>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </div>
      )}

      {/* --- DESKTOP NUMBERED LINKS --- */}
      <div className="hidden sm:flex items-center gap-1.5">
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="flex items-center justify-center w-8 h-8 text-white/40">
                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
              </span>
            );
          }

          const isActive = p === currentPage;

          return (
            <Link
              key={`page-${p}`}
              href={createPageURL(p)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: isActive ? "default" : "ghost" }),
                "w-10 h-10 p-0 rounded-full font-bold text-sm transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              {p}
            </Link>
          );
        })}
      </div>
      
      {/* --- MOBILE PAGE INDICATOR --- */}
      <span className="sm:hidden text-xs font-black uppercase tracking-widest text-white/40 px-2">
        Page <span className="text-primary">{currentPage}</span> / {totalPages}
      </span>
      
      {/* --- NEXT PAGE LINK --- */}
      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          rel="next" // ✅ SEO: Tells Google this is the next logical page
          className={cn(buttonVariants({ variant: "outline" }), "gap-1 sm:gap-2 rounded-full px-3 sm:px-4")}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <div className={cn(buttonVariants({ variant: "outline" }), "gap-1 sm:gap-2 rounded-full px-3 sm:px-4 opacity-50 cursor-not-allowed")}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </div>
      )}
    </nav>
  );
}