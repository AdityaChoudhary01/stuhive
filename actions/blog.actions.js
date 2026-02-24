"use server";

import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFileFromR2 } from "@/lib/r2"; 
import { indexNewContent, removeContentFromIndex } from "@/lib/googleIndexing"; 
import { pingIndexNow } from "@/lib/indexnow"; // 🚀 ADDED: IndexNow Integration
import { cache } from "react"; 

const APP_URL = process.env.NEXTAUTH_URL || "https://stuhive.in"; // 🚀 ADDED: Base URL for IndexNow

/**
 * FETCH BLOGS (Pagination, Search, Filter by Tags)
 * 🚀 WRAPPED IN CACHE: Prevents duplicate DB calls during server renders
 */
export const getBlogs = cache(async ({ page = 1, limit = 9, search = "", tag = "", isFeatured }) => {
  await connectDB();
  try {
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      query.$or = [{ title: regex }, { summary: regex }, { tags: regex }];
    }

    if (tag && tag !== 'All') {
      // Use a case-insensitive regex to match the exact tag
      query.tags = { $regex: new RegExp(`^${tag}$`, 'i') }; 
    }
    
    if (isFeatured) {
      query.isFeatured = true;
    }

    const blogs = await Blog.find(query)
      .select("-content -reviews") // 🚀 MASSIVE SPEED BOOST
      .populate('author', 'name avatar role email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    const safeBlogs = blogs.map(b => ({
      ...b,
      _id: b._id.toString(),
      author: b.author ? { ...b.author, _id: b.author._id.toString() } : null,
      summary: b.summary || "",
      tags: b.tags ? Array.from(b.tags) : [],
      rating: b.rating || 0,
      numReviews: b.numReviews || 0,
      viewCount: b.viewCount || 0,
      isFeatured: b.isFeatured || false,
      readTime: b.readTime || 3, // 🚀 FAST: Read pre-calculated time from DB
      reviews: [], // Excluded for speed
      createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: b.updatedAt ? b.updatedAt.toISOString() : new Date().toISOString(),
    }));

    return { 
      blogs: safeBlogs, 
      total, 
      totalPages: Math.ceil(total / limit) 
    };
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return { blogs: [], total: 0, totalPages: 0 };
  }
});

/**
 * GET BLOG BY SLUG
 * 🚀 WRAPPED IN CACHE: Shares data instantly between generateMetadata and the Page UI
 */
export const getBlogBySlug = cache(async (slug) => {
 await connectDB();
 try {
   const blog = await Blog.findOne({ slug })
     .populate('author', 'name avatar role email bio')
     .populate({
       path: 'reviews.user',
       select: 'name avatar role email'
     })
     .lean(); // 🚀 LEAN: Prevents Mongoose serialization bottleneck

   if (!blog) return null;

   const safeBlog = {
     ...blog,
     _id: blog._id.toString(),
     author: blog.author ? { ...blog.author, _id: blog.author._id.toString() } : null,
     summary: blog.summary || "",
     tags: blog.tags ? Array.from(blog.tags) : [],
     rating: blog.rating || 0,
     numReviews: blog.numReviews || 0,
     viewCount: blog.viewCount || 0,
     isFeatured: blog.isFeatured || false,
     readTime: blog.readTime || 3, // 🚀 FAST: Read pre-calculated time from DB
     reviews: blog.reviews ? blog.reviews.map(r => ({
       ...r,
       _id: r._id.toString(),
       parentReviewId: r.parentReviewId ? r.parentReviewId.toString() : null,
       user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
       createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
     })) : [],
     createdAt: blog.createdAt ? blog.createdAt.toISOString() : new Date().toISOString(),
     updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString(),
   };

   return safeBlog;
 } catch (error) {
   console.error("Get Blog By Slug Error:", error);
   return null;
 }
});

/**
 * INCREMENT BLOG VIEWS (Non-blocking)
 */
export async function incrementBlogViews(blogId) {
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(blogId, { $inc: { viewCount: 1 } });
    return true;
  } catch (error) {
    console.error("Failed to increment blog views:", error);
    return false;
  }
}

/**
 * UPDATE BLOG 
 */
export async function updateBlog(blogId, updateData, userId) {
  await connectDB();
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return { success: false, error: "Blog not found" };

    const session = await getServerSession(authOptions);
    
    const isOwner = blog.author.toString() === userId;
    const isAdmin = session?.user?.role === "admin";
    
    if (!isOwner && !isAdmin) {
      return { success: false, error: "Unauthorized to update this blog" };
    }

    // 1. R2 Cleanup
    if (updateData.coverImageKey && updateData.coverImageKey !== blog.coverImageKey) {
        if (blog.coverImageKey) {
            await deleteFileFromR2(blog.coverImageKey);
        }
    }

    const oldSlug = blog.slug;

    // 2. Handle Slug updating
    if (updateData.title && updateData.title !== blog.title) {
         let newSlug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
         const existing = await Blog.findOne({ slug: newSlug });
         if (existing && existing._id.toString() !== blogId) {
             newSlug = `${newSlug}-${Date.now()}`;
         }
         updateData.slug = newSlug;
    }

    // 🚀 3. PRE-CALCULATE READ TIME ON UPDATE
    if (updateData.content) {
        const wordCount = updateData.content.split(/\s+/).length;
        updateData.readTime = Math.ceil(wordCount / 200) || 1;
    }

    // Apply updates
    blog.set(updateData);
    await blog.save();

    // 🚀 4. SEO & INDEXING (Google + IndexNow)
    const urlsToPing = [`${APP_URL}/blogs/${blog.slug}`];

    if (updateData.slug && updateData.slug !== oldSlug) {
        const removeStatus = await removeContentFromIndex(oldSlug, 'blog');
        console.log(`[ACTION LOG] Blog URL changed. Old Google URL Removal ping: ${removeStatus ? 'DELIVERED' : 'FAILED'}`);
        // If slug changed, tell IndexNow to crawl the old one too so it sees the redirect/404
        urlsToPing.push(`${APP_URL}/blogs/${oldSlug}`);
    }
    
    const seoStatus = await indexNewContent(blog.slug, 'blog'); 
    console.log(`[ACTION LOG] Blog updated. Google Indexing ping: ${seoStatus ? 'DELIVERED' : 'FAILED'}`);

    // 🔥 INSTANT INDEXNOW PING
    await pingIndexNow(urlsToPing);
    
    revalidatePath(`/blogs/${blog.slug}`);
    revalidatePath('/blogs');
    
    return { success: true, slug: blog.slug };
  } catch (error) {
    console.error("Update Blog Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * CREATE BLOG
 */
export async function createBlog({ title, content, summary, tags, coverImage, coverImageKey, userId }) {
  await connectDB();
  try {
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    // 🚀 PRE-CALCULATE READ TIME ON CREATE
    const wordCount = content ? content.split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200) || 1;

    const newBlog = new Blog({
      title, content, summary, tags, slug,
      coverImage,           // The public R2 Read URL
      coverImageKey,        // The secret R2 object key for deletion later
      author: userId, rating: 0, numReviews: 0, viewCount: 0, isFeatured: false,
      readTime              // 🚀 Saved directly to DB
    });

    await newBlog.save();
    await User.findByIdAndUpdate(userId, { $inc: { blogCount: 1 } });

    // 🚀 SEO & INDEXING (Google + IndexNow)
    const seoStatus = await indexNewContent(newBlog.slug, 'blog');
    console.log(`[ACTION LOG] Blog created. Google Indexing ping: ${seoStatus ? 'DELIVERED' : 'FAILED'}`);

    // 🔥 INSTANT INDEXNOW PING
    await pingIndexNow([`${APP_URL}/blogs/${newBlog.slug}`]);

    revalidatePath('/blogs');
    return { success: true, slug: newBlog.slug };
  } catch (error) { return { success: false, error: error.message }; }
}

/**
 * DELETE BLOG 
 */
export async function deleteBlog(blogId, userId) {
  await connectDB();
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return { success: false, error: "Blog not found" };
    
    const session = await getServerSession(authOptions);
    if (blog.author.toString() !== userId && session?.user?.role !== "admin") return { success: false, error: "Unauthorized" };

    if (blog.coverImageKey) {
        await deleteFileFromR2(blog.coverImageKey);
    }

    // 🚀 SEO DE-INDEXING (Google + IndexNow)
    const seoStatus = await removeContentFromIndex(blog.slug, 'blog');
    console.log(`[ACTION LOG] Blog deleted. Google Removal ping: ${seoStatus ? 'DELIVERED' : 'FAILED'}`);

    // 🔥 INSTANT INDEXNOW PING (Tells them the URL is gone)
    await pingIndexNow([`${APP_URL}/blogs/${blog.slug}`]);

    await Blog.findByIdAndDelete(blogId);
    await User.findByIdAndUpdate(blog.author, { $inc: { blogCount: -1 } });
    
    revalidatePath('/blogs');
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
}

/**
 * ADD BLOG REVIEW
 */
export async function addBlogReview(blogId, userId, rating, comment, parentReviewId = null) {
  await connectDB();
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return { success: false, error: "Blog not found" };

    const newReview = {
      user: userId,
      rating: parentReviewId ? 0 : Number(rating),
      comment: comment,
      parentReviewId: parentReviewId || null,
      createdAt: new Date()
    };

    blog.reviews.push(newReview);

    const topLevelReviews = blog.reviews.filter(r => !r.parentReviewId);
    const totalRating = topLevelReviews.reduce((acc, curr) => acc + curr.rating, 0);
    blog.rating = topLevelReviews.length > 0 ? totalRating / topLevelReviews.length : 0;
    blog.numReviews = topLevelReviews.length;

    await blog.save();

    const updatedBlog = await Blog.findById(blogId).populate("reviews.user", "name avatar").lean();
    
    const safeReviews = updatedBlog.reviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      parentReviewId: r.parentReviewId ? r.parentReviewId.toString() : null,
      user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
      createdAt: r.createdAt.toISOString()
    }));

    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, reviews: safeReviews };
  } catch (error) {
    console.error("Add Blog Review Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE BLOG REVIEW
 */
export async function deleteBlogReview(blogId, reviewId) {
  await connectDB();
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return { success: false, error: "Blog not found" };

    blog.reviews = blog.reviews.filter(
      r => r._id.toString() !== reviewId && r.parentReviewId?.toString() !== reviewId
    );

    const topLevelReviews = blog.reviews.filter(r => !r.parentReviewId);
    const totalRating = topLevelReviews.reduce((acc, curr) => acc + curr.rating, 0);
    blog.rating = topLevelReviews.length > 0 ? totalRating / topLevelReviews.length : 0;
    blog.numReviews = topLevelReviews.length;

    await blog.save();

    const updatedBlog = await Blog.findById(blogId).populate("reviews.user", "name avatar").lean();
    const safeReviews = updatedBlog.reviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      parentReviewId: r.parentReviewId ? r.parentReviewId.toString() : null,
      user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
      createdAt: r.createdAt.toISOString()
    }));

    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, reviews: safeReviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * GET RELATED BLOGS
 * 🚀 WRAPPED IN CACHE
 */
export const getRelatedBlogs = cache(async (blogId) => {
  await connectDB();
  try {
    const relatedBlogs = await Blog.find({ _id: { $ne: blogId } })
      .select('title summary slug createdAt author rating numReviews isFeatured coverImage viewCount tags readTime')
      .populate('author', 'name avatar role email')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const safeRelated = relatedBlogs.map(b => ({
      ...b,
      _id: b._id.toString(),
      author: b.author ? { ...b.author, _id: b.author._id.toString() } : null,
      tags: b.tags ? Array.from(b.tags) : [],
      viewCount: b.viewCount || 0,
      readTime: b.readTime || 3, // 🚀 FAST: Propagated down
      createdAt: b.createdAt?.toISOString()
    }));
    return safeRelated;
  } catch (error) { return []; }
});

/**
 * GET MY BLOGS
 */
export async function getMyBlogs(userId) {
  await connectDB();
  try {
    const blogs = await Blog.find({ author: userId })
      .select("-content -reviews") // 🚀 SPEED BOOST
      .sort({ createdAt: -1 })
      .lean();
      
    const safeBlogs = blogs.map(b => ({
      ...b, 
      _id: b._id.toString(), 
      tags: b.tags ? Array.from(b.tags) : [],
      author: b.author?.toString(), 
      readTime: b.readTime || 3, // 🚀 FAST: Propagated down
      createdAt: b.createdAt?.toISOString()
    }));
    return safeBlogs;
  } catch (error) { return []; }
}

/**
 * GET BLOGS FOR USER
 */
export async function getBlogsForUser(userId) {
  await connectDB();
  try {
    const blogs = await Blog.find({ author: userId })
      .select("-content -reviews") // 🚀 SPEED BOOST
      .sort({ createdAt: -1 })
      .lean();

    const safeBlogs = blogs.map(b => ({
      ...b,
      _id: b._id.toString(),
      author: b.author ? b.author.toString() : null,
      summary: b.summary || "",
      tags: b.tags ? Array.from(b.tags) : [],
      rating: b.rating || 0,
      numReviews: b.numReviews || 0,
      viewCount: b.viewCount || 0,
      isFeatured: b.isFeatured || false,
      readTime: b.readTime || 3, // 🚀 FAST: Propagated down
      reviews: [], 
      createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: b.updatedAt ? b.updatedAt.toISOString() : new Date().toISOString(),
    }));

    return safeBlogs;
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return [];
  }
}

/**
 * GET UNIQUE BLOG TAGS (CATEGORIES)
 * 🚀 WRAPPED IN CACHE
 */
export const getUniqueBlogTags = cache(async () => {
  await connectDB();
  try {
    const rawTags = await Blog.distinct("tags");
    
    const cleanTags = rawTags
      .filter(t => t && t.trim() !== "")
      .map(t => t.trim());

    const uniqueTags = [...new Set(cleanTags.map(t => t.toLowerCase()))]
      .map(t => t.charAt(0).toUpperCase() + t.slice(1))
      .sort();

    return uniqueTags;
  } catch (error) {
    console.error("Error fetching unique tags:", error);
    return [];
  }
});