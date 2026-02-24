import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Note from "@/lib/models/Note";
import Blog from "@/lib/models/Blog";
import User from "@/lib/models/User";

const APP_URL = process.env.NEXTAUTH_URL || "https://stuhive.in";
const INDEXNOW_KEY = "363d05a6f7284bcf8b9060f495d58655";

export async function GET(request) {
  // Optional: Add a secret key to prevent random people from triggering this URL
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  // Replace 'my-super-secret-trigger' with a password of your choice
  if (secret !== "my-super-secret-trigger") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // 1. Add ALL your Static & Legal Pages
    let urls = [
      `${APP_URL}/`,
      `${APP_URL}/search`,
      `${APP_URL}/global-search`,
      `${APP_URL}/blogs`,
      `${APP_URL}/donate`,
      `${APP_URL}/supporters`,
      `${APP_URL}/about`,
      `${APP_URL}/contact`,
      `${APP_URL}/privacy`,
      `${APP_URL}/terms`,
      `${APP_URL}/dmca`,
      `${APP_URL}/login`,
      `${APP_URL}/register`,
    ];

    // 2. Fetch all Dynamic Blogs
    const blogs = await Blog.find({}).select('slug').lean();
    blogs.forEach(b => urls.push(`${APP_URL}/blogs/${b.slug}`));

    // 3. Fetch all Dynamic Notes
    const notes = await Note.find({}).select('_id').lean();
    notes.forEach(n => urls.push(`${APP_URL}/notes/${n._id.toString()}`));

    // 4. Fetch all Dynamic Public Profiles
    const users = await User.find({}).select('_id').lean();
    users.forEach(u => urls.push(`${APP_URL}/profile/${u._id.toString()}`));

    // 🚀 Send the massive URL list to IndexNow via Microsoft/Bing's endpoint
    // Note: IndexNow accepts up to 10,000 URLs per request.
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "stuhive.in",
        key: INDEXNOW_KEY,
        keyLocation: `${APP_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok || response.status === 202) {
      return NextResponse.json({ 
        success: true, 
        message: `Successfully submitted ${urls.length} URLs to IndexNow! Search engines are crawling them now.`,
        urlsSubmitted: urls.length
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ success: false, error: errorText }, { status: 400 });
    }

  } catch (error) {
    console.error("IndexNow Submission Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}