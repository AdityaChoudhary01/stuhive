"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderHeart, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPublicCollections } from "@/actions/collection.actions";

export default function CollectionGrid({ initialCollections, totalCount }) {
  const [collections, setCollections] = useState(initialCollections);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = collections.length < totalCount;

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      // Fetch the next 12 items
      const res = await getPublicCollections({ page: nextPage, limit: 12 });
      if (res?.collections) {
        setCollections((prev) => [...prev, ...res.collections]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more collections", error);
    } finally {
      setLoading(false);
    }
  };

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 animate-in fade-in duration-700">
        <div className="p-6 bg-white/5 rounded-full mb-6">
          <BookOpen size={40} className="text-gray-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-white mb-2">No Archives Found</h3>
        <p className="text-gray-400 text-base max-w-sm text-center leading-relaxed">
          Our contributors are currently indexing new semester bundles. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-150">
        {collections.map((col) => (
          <Link 
            href={`/shared-collections/${col.slug}`} 
            key={col._id} 
            className="group outline-none"
            title={`Access ${col.name} curated materials`}
          >
            <article className="flex flex-col justify-between h-full p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-3xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
              
              {/* Subtle Hover Glow inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

              <div>
                <header className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-white/5 rounded-xl text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-300">
                    <FolderHeart size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-gray-300">{col.notes?.length || 0} Files</span>
                  </div>
                </header>

                <h3 className="text-xl font-bold mb-3 leading-tight tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  {col.name}
                </h3>
                
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-8">
                   {col.description || `Optimized academic collection for ${col.name}. Expertly organized for your exam readiness.`}
                </p>
              </div>

              <footer className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                   <Avatar className="h-8 w-8 border border-white/20">
                      <AvatarImage src={col.user?.avatar} alt={col.user?.name || "User"} />
                      <AvatarFallback className="bg-gray-800 text-gray-300 text-xs font-bold">
                        {col.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                   </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-300 truncate max-w-[100px] group-hover:text-white transition-colors">
                      {col.user?.name}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-widest text-gray-500">
                      Curator
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gray-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                  <ArrowRight size={14} />
                </div>
              </footer>
            </article>
          </Link>
        ))}
      </div>

      {/* 🚀 LOAD MORE BUTTON */}
      {hasMore && (
        <div className="mt-16 flex justify-center animate-in fade-in duration-500">
          <Button 
            onClick={handleLoadMore} 
            disabled={loading}
            variant="outline"
            className="rounded-full px-8 py-6 text-xs sm:text-sm font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 hover:border-cyan-400/50 hover:text-white text-gray-300 transition-all duration-300"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching Archives...</>
            ) : (
              "Load More Bundles"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}