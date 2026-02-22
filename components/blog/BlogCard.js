import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Star, Eye, ShieldCheck } from "lucide-react"; 
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BlogCard({ blog }) {
  // 🚀 FAST: Read directly from the DB property, fallback to 3 mins for older legacy blogs
  const readTime = blog.readTime || 3; 
  const rating = blog.rating || 0;
  const views = blog.viewCount || 0;
  const isAdmin = blog.author?.role === 'admin';

  // ✅ 1. SEO: Structured Data (JSON-LD)
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.coverImage || "/default-blog.png",
    "datePublished": blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author?.name,
      "jobTitle": isAdmin ? "Admin" : "Contributor"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StuHive",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stuhive.in/logo512.png"
      }
    },
    "description": blog.summary || blog.excerpt || "",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating || 5,
      "reviewCount": blog.numReviews || 1
    }
  };

  return (
    <article className="h-full"> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      
      <Link href={`/blogs/${blog.slug}`} title={`Read: ${blog.title}`} className="block h-full group">
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(102,126,234,0.15)] hover:border-primary/40 flex flex-col bg-white/[0.03] backdrop-blur-md border border-white/10 hover:-translate-y-1">
          
          {/* Cover Image */}
          <div className="relative h-48 w-full overflow-hidden bg-secondary/20">
            {blog.coverImage ? (
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                loading="lazy" 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium bg-secondary/5">
                <span className="text-xs uppercase tracking-widest opacity-50 font-black">StuHive Article</span>
              </div>
            )}
            
            {/* Tags overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {blog.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-lg text-[10px] uppercase tracking-wider font-bold px-2.5 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 pointer-events-none" />
          </div>

          <CardContent className="flex flex-col flex-grow p-5 sm:p-6 bg-[#0a0a0a]">
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <time dateTime={blog.createdAt} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {formatDate(blog.createdAt)}
              </time>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Clock className="w-3.5 h-3.5 text-pink-400" /> {readTime} min read
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Eye className="w-3.5 h-3.5 text-purple-400" /> {views} views
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight mb-3 line-clamp-2 text-white/95 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300">
              {blog.title}
            </h3>
            
            {/* Star Ratings Section */}
            <div className="flex items-center gap-2 mb-4 bg-white/[0.02] w-fit px-3 py-1.5 rounded-full border border-white/5" aria-label={`Rated ${rating.toFixed(1)} stars`}>
              <div className="flex gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "fill-yellow-500 text-yellow-500" : "text-white/20"}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-white/50">
                {rating.toFixed(1)} ({blog.numReviews || 0})
              </span>
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-medium">
              {blog.summary || blog.excerpt || "Dive into this comprehensive article to learn more about the topic..."}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarImage src={blog.author?.avatar} alt={blog.author?.name} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-xs font-black">{blog.author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white/80 flex items-center gap-1.5">
                      {blog.author?.name || "StuHive Writer"} 
                      {isAdmin && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Admin/Verified" />
                      )}
                  </span>
                </div>
              </div>
              
              <div className="text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 group-hover:translate-x-1 group-hover:text-cyan-300 transition-all duration-300 bg-cyan-400/10 px-3 py-1.5 rounded-full">
                Read <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}