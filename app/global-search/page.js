import { performGlobalSearch } from "@/actions/search.actions";
import NoteCard from "@/components/notes/NoteCard";
import BlogCard from "@/components/blog/BlogCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Rss, Users, Search as SearchIcon, PenTool } from "lucide-react";

// 🚀 ENFORCED WWW DOMAIN
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.stuhive.in";

// ✅ 1. SEO METADATA FOR GLOBAL SEARCH
export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  
  const title = query ? `Search results for "${query}"` : "Global Hub Search";
  
  return {
    title: `${title} | StuHive`,
    description: `Discover academic notes, student blogs, and top contributors matching "${query}" on the StuHive network.`,
    alternates: {
      canonical: `${APP_URL}/global-search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function GlobalSearchPage({ searchParams }) {
  // 🚀 NEXT.JS 15 FIX: Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  
  const { notes, blogs, users } = await performGlobalSearch(query);

  const totalResults = notes.length + blogs.length + users.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
      { "@type": "ListItem", "position": 2, "name": "Global Search", "item": `${APP_URL}/global-search` }
    ]
  };

  return (
    <div className="container max-w-7xl py-24 min-h-screen">
      {/* INJECT STRUCTURED DATA */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Search Header */}
      <header className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2 flex items-center gap-3 text-white tracking-tight">
          <SearchIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" aria-hidden="true" />
          Global Search
        </h1>
        <p className="text-muted-foreground text-sm md:text-base font-medium">
          Showing {totalResults} results for <span className="text-primary font-bold">&quot;{query}&quot;</span>
        </p>
      </header>

      {totalResults === 0 ? (
        <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-white/10">
          <p className="text-xl text-muted-foreground font-bold">No matches found for your search.</p>
          <Link href="/" title="Return Home" className="text-primary hover:text-cyan-400 hover:underline mt-4 block font-black uppercase tracking-widest text-sm transition-colors">
            Return Home
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* 1. NOTES RESULTS */}
          {notes.length > 0 && (
            <section aria-labelledby="notes-heading">
              <h2 id="notes-heading" className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <FileText className="text-cyan-400" aria-hidden="true" /> Study Notes ({notes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                  <article key={note._id} className="w-full h-full">
                    <NoteCard note={note} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 2. BLOG RESULTS */}
          {blogs.length > 0 && (
            <section aria-labelledby="blogs-heading">
              <h2 id="blogs-heading" className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Rss className="text-pink-500" aria-hidden="true" /> Community Blogs ({blogs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                  <article key={blog._id} className="w-full h-full">
                    <BlogCard blog={blog} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 3. USER RESULTS */}
          {users.length > 0 && (
            <section aria-labelledby="users-heading">
              <h2 id="users-heading" className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Users className="text-purple-500" aria-hidden="true" /> Students & Contributors ({users.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                  <Link href={`/profile/${user._id}`} key={user._id} title={`View ${user.name}'s Profile`}>
                    <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-primary/50 transition-all duration-300 group rounded-2xl overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white/10 group-hover:border-primary transition-colors">
                          <AvatarImage src={user.avatar || user.image} alt={user.name} />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="overflow-hidden flex-1">
                          <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                            {user.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground mt-1 font-medium">
                            <span className="capitalize text-gray-300">{user.role || 'Student'}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            
                            {/* 🚀 FIXED: Displays both Notes and Blogs beautifully */}
                            <span className="flex items-center gap-1">
                               <FileText className="w-3 h-3 text-cyan-400" /> {user.noteCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                               <PenTool className="w-3 h-3 text-purple-400" /> {user.blogCount || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}