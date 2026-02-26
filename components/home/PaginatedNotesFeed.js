"use client";

import { useState } from "react";
import NoteCard from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { getNotes } from "@/actions/note.actions";
import { Loader2, ChevronDown, Compass } from "lucide-react";
import Link from "next/link";

export default function PaginatedNotesFeed({ initialNotes, initialTotalPages }) {
  const [notes, setNotes] = useState(initialNotes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const loadMore = async () => {
    if (page >= totalPages) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const res = await getNotes({ page: nextPage, limit: 12 });

      setNotes((prev) => [...prev, ...res.notes]);
      setPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error loading more notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBtnClass =
    "group relative w-full sm:w-auto h-12 rounded-full px-9 " +
    "bg-white/[0.03] border border-white/10 text-white " +
    "font-black uppercase tracking-[0.22em] text-[10px] sm:text-[11px] " +
    "transition-all duration-300 transform-gpu will-change-transform " +
    "hover:bg-white/[0.07] hover:border-cyan-500/40 hover:-translate-y-0.5 " +
    "hover:shadow-[0_22px_55px_-30px_rgba(34,211,238,0.55)] " +
    "active:translate-y-0 " +
    "outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 " +
    "overflow-hidden";

  return (
    <div className="space-y-10">
      {/* 🚀 SEO: ItemList Schema directly injected via Microdata for dynamic client content */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 justify-items-center"
        aria-live="polite"
        aria-busy={loading}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        {notes.map((note, index) => (
          <div
            key={note._id}
            className="w-full"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={index + 1} />
            <div itemProp="item" itemScope itemType="https://schema.org/LearningResource">
              <div className="relative">
                {/* subtle lift consistency (no logic change) */}
                <div className="absolute -inset-2 rounded-[34px] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(600px_circle_at_50%_20%,rgba(34,211,238,0.10),transparent_45%)]" />
                <NoteCard note={note} priority={index < 6 && page === 1} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {page < totalPages && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 relative">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={loading}
            aria-label={loading ? "Loading more notes..." : "Load more notes"}
            className={loadBtnClass}
          >
            {/* sheen */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(900px_circle_at_30%_20%,rgba(34,211,238,0.16),transparent_45%)]" />
            <span className="absolute inset-0 -translate-x-full motion-safe:group-hover:animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12" />

            <span className="relative z-10 inline-flex items-center">
              {loading ? (
                <Loader2 aria-hidden="true" className="w-4 h-4 mr-2 animate-spin text-cyan-400" />
              ) : (
                <ChevronDown
                  aria-hidden="true"
                  className="w-4 h-4 mr-2 text-cyan-400 group-hover:translate-y-1 transition-transform"
                />
              )}
              {loading ? "Fetching Materials..." : "Load More Notes"}
            </span>
          </Button>

          <noscript>
            <Link href={`/search?page=${page + 1}`} title="Next page of notes" className="text-[10px] text-cyan-400 underline">
              Browse page {page + 1} of academic notes
            </Link>
          </noscript>
        </div>
      )}

      {page >= totalPages && totalPages > 0 && (
        <div className="flex justify-center pt-8 animate-in fade-in duration-700">
          <Link
            href="/search"
            className="group relative flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]
              text-white/45 hover:text-cyan-300 transition-colors
              bg-white/5 px-7 py-3 rounded-full hover:bg-white/10
              border border-white/10 hover:border-cyan-500/30
              shadow-[0_18px_50px_-35px_rgba(0,0,0,0.8)]
              outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 overflow-hidden"
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(700px_circle_at_20%_20%,rgba(34,211,238,0.14),transparent_45%)]" />
            <Compass size={14} aria-hidden="true" className="relative z-10" />{" "}
            <span className="relative z-10">Discover the full archive</span>
          </Link>
        </div>
      )}
    </div>
  );
}
