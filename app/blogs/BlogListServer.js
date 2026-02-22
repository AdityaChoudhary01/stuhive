import Link from "next/link";
import { getBlogs, getUniqueBlogTags } from "@/actions/blog.actions";
import BlogCard from "@/components/blog/BlogCard"; 
import Pagination from "@/components/common/Pagination";
import { Hash } from "lucide-react"; 
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXTAUTH_URL || "https://stuhive.in";

export default async function BlogListServer({ params }) {
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const tag = params.tag || "All";

  const [blogsData, dynamicTags] = await Promise.all([
      getBlogs({ page, search, tag }),
      getUniqueBlogTags()
  ]);

  const { blogs, totalPages } = blogsData;
  const categories = ["All", ...dynamicTags]; 

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "StuHive Academic Blogs",
    "description": "A collection of student-written articles about education, technology, and university life.",
    "url": `${APP_URL}/blogs`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogs.map((b, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${APP_URL}/blogs/${b.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🚀 FIXED: Added the max-w-4xl wrapper JUST for the tags navigation */}
      <div className="max-w-4xl mx-auto mb-12 space-y-6">
        <nav className="relative w-full" aria-label="Blog Categories">
            <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            
            <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x px-4 md:justify-center">
                {categories.map((cat) => {
                    const searchParams = new URLSearchParams();
                    if (search) searchParams.set("search", search);
                    if (cat !== "All") searchParams.set("tag", cat);
                    
                    const queryString = searchParams.toString();
                    const tagUrl = `/blogs${queryString ? `?${queryString}` : ""}`;

                    return (
                        <Link 
                            key={cat} 
                            href={tagUrl}
                            title={`View posts in ${cat}`}
                            className={`snap-start whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                                tag === cat 
                                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] border-transparent" 
                                : "bg-secondary/20 hover:bg-secondary/40 text-muted-foreground border border-border/50 hover:text-foreground"
                            }`}
                        >
                            {cat}
                        </Link>
                    );
                })}
            </div>
        </nav>
      </div>

      {/* 🚀 FIXED: The grid is now free to expand to its normal wide size */}
      <section aria-label="Blog posts grid">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                  <article key={blog._id} className="h-full transform transition-all duration-300 hover:-translate-y-2">
                      <BlogCard blog={blog} />
                  </article>
              ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/5 rounded-[2.5rem] border border-dashed border-border/60 shadow-inner">
              <Hash className="mx-auto h-16 w-16 text-muted-foreground/20 mb-6" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
              <p className="text-base text-muted-foreground">Be the first to share your experience with the community!</p>
              
              {(search || tag !== "All") && (
                <Link href="/blogs" className="inline-block mt-6">
                  <Button variant="outline" className="rounded-full">Clear Filters</Button>
                </Link>
              )}
          </div>
        )}
      </section>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <footer className="mt-16" aria-label="Pagination">
            <Pagination currentPage={page} totalPages={totalPages} />
        </footer>
      )}
    </>
  );
}