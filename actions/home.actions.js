"use server";

import connectDB from "@/lib/db";
import Note from "@/lib/models/Note";
import User from "@/lib/models/User";
import Blog from "@/lib/models/Blog";

export async function getHomeData() {
  await connectDB();

  try {
    // ⚡ PERFORMANCE BOOST: Run all database queries in parallel
    const [
      totalNotes,
      totalUsers,
      totalDownloadsRes,
      blogs
    ] = await Promise.all([
      // 1. Fetch Stats
      Note.countDocuments(),
      User.countDocuments(),
      Note.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),

      // 2. Fetch Featured Blogs (Latest 3)
      Blog.find({}) 
        .populate("author", "name avatar image role")
        .sort({ createdAt: -1 }) 
        .limit(3)
        .lean()
        .catch(e => {
            console.error("Error fetching blogs for homepage:", e);
            return []; // Fallback to empty array if blog fetch fails
        })
    ]);

    const totalDownloads = totalDownloadsRes[0]?.total || 0;

    return {
      stats: { totalNotes, totalUsers, totalDownloads },
      // Serialize Blogs strictly for Client Components
      blogs: blogs.map(b => ({
        ...b,
        _id: b._id.toString(),
        author: b.author ? { ...b.author, _id: b.author._id.toString() } : null,
        summary: b.summary || b.excerpt || "",
        coverImage: b.coverImage || null,
        tags: b.tags ? Array.from(b.tags) : [],
        rating: b.rating || 0,
        numReviews: b.numReviews || 0,
        viewCount: b.viewCount || 0,
        createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString()
      }))
    };
    
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return { 
        stats: { totalNotes: 0, totalUsers: 0, totalDownloads: 0 }, 
        blogs: [] 
    };
  }
}