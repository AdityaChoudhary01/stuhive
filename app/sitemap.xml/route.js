export const dynamic = 'force-dynamic';
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";
import Note from "@/lib/models/Note";
import User from "@/lib/models/User";
import Collection from "@/lib/models/Collection"; 

const BASE_URL = 'https://www.stuhive.in';

const formatDate = (date) => {
  try {
    return new Date(date).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

export async function GET() {
  try {
    await connectDB();

    // 🚀 Fetch all models and aggregations in parallel for maximum speed
    const blogsPromise = Blog.find({}).select("slug updatedAt").lean();
    const notesPromise = Note.find({}).select("_id updatedAt").lean();
    const usersPromise = User.find({}).select("_id updatedAt").lean();
    const collectionsPromise = Collection.find({ visibility: 'public' }).select("slug updatedAt").lean();
    
    // 🚀 ADDED: Get all unique universities and their latest update time directly from Notes
    const universitiesPromise = Note.aggregate([
      { $match: { university: { $ne: null, $ne: "" } } },
      { $group: { 
          _id: "$university", 
          updatedAt: { $max: "$updatedAt" } 
      }}
    ]);

    const [blogs, notes, users, collections, universities] = await Promise.all([
      blogsPromise,
      notesPromise,
      usersPromise,
      collectionsPromise,
      universitiesPromise 
    ]);

    // DEBUG: See what is actually being returned
    console.log(`[SITEMAP] Found ${blogs.length} blogs, ${notes.length} notes, ${users.length} users, ${collections.length} collections, ${universities.length} universities.`);
    
    if (blogs.length === 0) {
      console.warn("[SITEMAP] WARNING: No blogs found in the database. Are they published?");
    }

    // 🚀 STATIC ROUTES (Added /hive-points here)
    const staticRoutes = [
      "", "/about", "/contact", "/blogs", "/search", "/shared-collections", "/requests",
      "/login","/signup", 
      "/donate", "/supporters", "/terms", "/privacy", "/dmca", "/hive-points"
    ].map(route => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date().toISOString(),
      priority: route === "" ? "1.0" : route === "/requests" ? "0.9" : "0.5", // Boosted priority for requests board
      changefreq: route === "/requests" ? "daily" : "monthly", // Requests board changes frequently
    }));

    // Filter out any blogs that somehow don't have a slug to prevent malformed URLs
    const blogPages = blogs
      .filter(blog => blog.slug) 
      .map(blog => ({
        url: `${BASE_URL}/blogs/${blog.slug}`,
        lastModified: formatDate(blog.updatedAt),
        priority: "0.8",
        changefreq: "weekly",
      }));

    const notePages = notes.map(note => ({
      url: `${BASE_URL}/notes/${note._id.toString()}`,
      lastModified: formatDate(note.updatedAt),
      priority: "0.9",
      changefreq: "daily",
    }));

    const profilePages = users.map(user => ({
      url: `${BASE_URL}/profile/${user._id.toString()}`,
      lastModified: formatDate(user.updatedAt),
      priority: "0.6",
      changefreq: "weekly",
    }));

    // 🚀 DYNAMICALLY GENERATE COLLECTION PAGES
    const collectionPages = collections
      .filter(col => col.slug) // Prevent undefined slugs
      .map(col => ({
        url: `${BASE_URL}/shared-collections/${col.slug}`,
        lastModified: formatDate(col.updatedAt),
        priority: "0.8",
        changefreq: "weekly",
      }));

    // 🚀 NEW: DYNAMICALLY GENERATE UNIVERSITY HUB PAGES
    const universityPages = universities.map(univ => {
      const slug = univ._id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return {
        url: `${BASE_URL}/univ/${slug}`,
        lastModified: formatDate(univ.updatedAt), // Uses the time of the most recently uploaded note for this univ!
        priority: "0.9", // High priority because these are major landing pages
        changefreq: "daily",
      };
    });

    // 🚀 MERGE EVERYTHING TOGETHER
    const allPages = [...staticRoutes, ...universityPages, ...blogPages, ...notePages, ...profilePages, ...collectionPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => `<url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join("")}
</urlset>`;

    // 🚀 THE CACHE FIX: To test changes immediately, temporarily remove the Cache-Control header
    // so Cloudflare doesn't serve you a stale version. Put it back once it's working.
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        // "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200", 
      },
    });
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${BASE_URL}</loc></url></urlset>`, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}