import Link from "next/link";
import { Suspense } from "react";
import BlogSearchClient from "@/components/blog/BlogSearchClient"; 
import { PenTool } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import BlogListServer from "./BlogListServer"; 

const APP_URL = process.env.NEXTAUTH_URL || "https://www.stuhive.in";

// ✅ 1. OPTIMIZATION: Enable aggressive edge caching for fast TTFB (Time to First Byte)
export const dynamic = "force-dynamic";
export const revalidate = 60; 

// ✅ DYNAMIC METADATA
export async function generateMetadata({ searchParams }) {
  const params = await searchParams; 
  const page = params.page || 1;
  const tag = params.tag || "All";
  
  return {
    title: page > 1 ? `Articles - Page ${page} | StuHive` : "Insights & Stories | Academic Blog",
    description: `Browse ${tag !== "All" ? tag : ""} academic articles and study tips from the community. Page ${page}.`,
    alternates: {
      canonical: `${APP_URL}/blogs`,
    },
    openGraph: {
      title: "StuHive Insights | The Student Blog",
      description: "Knowledge sharing and experiences from students worldwide.",
      url: `${APP_URL}/blogs`,
      siteName: "StuHive",
      type: "website",
    },
  };
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  
  // Use a stable key for Suspense based on the resolved params
  const suspenseKey = JSON.stringify(params);

  return (
    <main className="container py-12 pt-24 min-h-screen">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header Section */}
      <header className="text-center mb-12 space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 tracking-tight pb-2">
            Insights & Stories
        </h1>
        {/* FIXED ACCESSIBILITY: Heading hierarchy */}
        <h2 className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore peer-contributed articles on exam prep, technology journeys, and student life.
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/blogs/post" title="Write a new article">
                <Button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 border-0 shadow-lg hover:shadow-pink-500/25 transition-all text-white font-bold h-12 px-6">
                    <PenTool className="mr-2.5 h-4 w-4" aria-hidden="true" /> Write a Blog
                </Button>
            </Link>
            <Link href="/blogs/my-blogs" title="View my articles">
                 <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 hover:bg-white/5 font-bold text-foreground">
                    My Articles
                 </Button>
            </Link>
        </div>
      </header>
      
      <section className="max-w-4xl mx-auto mb-10" aria-label="Search">
        <BlogSearchClient initialSearch={search} />
      </section>

      {/* ✅ 2. OPTIMIZATION: Skeleton Fallback preserves layout to keep CLS at 0 */}
      <Suspense key={suspenseKey} fallback={<BlogGridLoader />}>
          <BlogListServer params={params} />
      </Suspense>
    </main>
  );
}

function BlogGridLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10" aria-hidden="true">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-[400px] w-full rounded-3xl bg-white/5 animate-pulse border border-white/10" />
      ))}
    </div>
  );
}