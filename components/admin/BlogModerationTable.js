"use client";

import { useState } from "react";
import { toggleBlogFeatured, adminDeleteBlog, getAllBlogs } from "@/actions/admin.actions"; // 🚀 Imported getAllBlogs
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; 
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, ExternalLink, MessageSquare, Eye, Loader2, FileText, ShieldAlert, Search, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BlogModerationTable({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingId, setLoadingId] = useState(null);

  // 🚀 REAL PAGINATION STATE
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length === 20); 

  const { toast } = useToast();

  const handleToggleFeatured = async (blogId, currentState) => {
    setLoadingId(blogId);
    const res = await toggleBlogFeatured(blogId, currentState);
    if (res.success) {
      setBlogs(blogs.map(b => b._id === blogId ? { ...b, isFeatured: !currentState } : b));
      toast({ title: !currentState ? "Blog Featured" : "Feature Removed" });
    } else {
      toast({ title: "Error", description: res.error || "Failed to update", variant: "destructive" });
    }
    setLoadingId(null);
  };

  const handleDelete = async (blogId) => {
    if (!confirm("Are you sure? This will permanently delete the article and its cover image.")) return;
    setLoadingId(blogId);
    const res = await adminDeleteBlog(blogId);
    if (res.success) {
      setBlogs(blogs.filter(b => b._id !== blogId));
      toast({ title: "Blog & Assets Deleted", variant: "destructive" });
    } else {
      toast({ title: "Error", description: res.error || "Failed to delete", variant: "destructive" });
    }
    setLoadingId(null);
  };

  // 🚀 REAL DB FETCH FOR LOAD MORE
  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await getAllBlogs(nextPage, 20);
    
    if (res?.blogs?.length > 0) {
      setBlogs((prev) => [...prev, ...res.blogs]);
      setPage(nextPage);
      if (res.blogs.length < 20) setHasMore(false); // No more pages left
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  // INSTANT SEARCH ENGINE
  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border border-white/10 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl">
      
      {/* 🚀 SEARCH & UTILITY BAR */}
      <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01]">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search loaded blogs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-black/40 border-white/10 text-sm focus-visible:ring-purple-500 text-white placeholder:text-gray-600 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1.5 h-auto text-xs font-bold uppercase tracking-widest">
            {filteredBlogs.length} Loaded
          </Badge>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="bg-white/[0.02] text-white/40 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Article Content</th>
              <th className="px-6 py-5">Author</th>
              <th className="px-6 py-5 hidden sm:table-cell text-center">Engagement</th>
              <th className="px-8 py-5 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBlogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-white/[0.03] transition-all group">
                
                {/* 1. Article Preview Column */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                      {blog.coverImage ? (
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title} 
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-white/20 absolute inset-0 m-auto" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white text-base truncate max-w-[250px] lg:max-w-[300px]" title={blog.title}>
                        {blog.title}
                      </span>
                      <div className="flex flex-wrap gap-2 items-center mt-1.5">
                        {blog.isFeatured && (
                          <Badge className="h-4 text-[9px] bg-cyan-500 hover:bg-cyan-400 text-black px-2 font-black uppercase tracking-tighter border-0">
                            Featured
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <Calendar className="w-3 h-3" />
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono uppercase truncate max-w-[120px]">
                          /{blog.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Author Column */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-white/10 shadow-lg">
                      <AvatarImage src={blog.author?.avatar} referrerPolicy="no-referrer" />
                      <AvatarFallback className="text-[10px] bg-secondary font-bold text-purple-400">{blog.author?.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white/90 group-hover:text-purple-400 transition-colors">{blog.author?.name || "Anonymous"}</span>
                        <span className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-0.5">{blog.author?.role || "User"}</span>
                    </div>
                  </div>
                </td>

                {/* 3. Stats Column */}
                <td className="px-6 py-5 hidden sm:table-cell">
                  <div className="flex items-center justify-center gap-6 text-white/60 font-bold">
                    <div className="flex flex-col items-center gap-1 group-hover:text-cyan-400 transition-colors" title={`${blog.viewCount || 0} Views`}>
                        <Eye className="w-4 h-4"/>
                        <span className="text-[11px] font-black">{blog.viewCount || 0}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 group-hover:text-purple-400 transition-colors" title={`${blog.numReviews || 0} Reviews`}>
                        <MessageSquare className="w-4 h-4"/>
                        <span className="text-[11px] font-black">{blog.numReviews || 0}</span>
                    </div>
                  </div>
                </td>

                {/* 4. Action Buttons */}
                <td className="px-8 py-5 text-right space-x-2 whitespace-nowrap">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title={blog.isFeatured ? "Remove Feature" : "Feature Article"}
                    className={`h-9 w-9 rounded-xl transition-all ${blog.isFeatured ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "text-white/30 hover:text-cyan-400 hover:bg-white/5"}`}
                    onClick={() => handleToggleFeatured(blog._id, blog.isFeatured)}
                    disabled={loadingId === blog._id}
                  >
                    <Star className={`w-4 h-4 ${blog.isFeatured ? "fill-current" : ""}`} />
                  </Button>
                  
                  <Link href={`/blogs/${blog.slug}`} target="_blank" title="View Public Article">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Delete Article"
                    className="h-9 w-9 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    onClick={() => handleDelete(blog._id)}
                    disabled={loadingId === blog._id}
                  >
                    {loadingId === blog._id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🚀 TRUE BACKEND LOAD MORE BUTTON */}
      {hasMore && !searchTerm && (
        <div className="p-4 flex justify-center border-t border-white/5 bg-white/[0.01]">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-10 px-6 transition-all"
          >
             {loadingMore ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Loading...</>
            ) : (
                <>Load More Articles <ChevronDown className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      )}

      {filteredBlogs.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-white/20 bg-black/20">
            <ShieldAlert size={48} className="mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-[0.2em] text-sm text-white/40">
              {searchTerm ? "No blogs match your search" : "No articles pending moderation"}
            </p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2 text-cyan-400">
                Clear Search
              </Button>
            )}
        </div>
      )}
    </div>
  );
}