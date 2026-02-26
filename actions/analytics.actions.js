"use server";

import connectDB from "@/lib/db";
import Analytics from "@/lib/models/Analytics";
import Note from "@/lib/models/Note";
import SiteAnalytics from "@/lib/models/SiteAnalytics";
/**
 * 1. LOG AN EVENT (Call this silently when someone views/downloads)
 */
export async function trackCreatorEvent(creatorId, type) { // type: 'views' | 'downloads'
  if (!creatorId) return;
  try {
    await connectDB();
    const dateStr = new Date().toISOString().split('T')[0]; // Gets today's date "YYYY-MM-DD"

    await Analytics.findOneAndUpdate(
      { user: creatorId, date: dateStr },
      { $inc: { [type]: 1 } },
      { upsert: true, new: true } // Upsert: Creates a new document if today doesn't exist yet!
    );
  } catch (error) {
    console.error(`Failed to track ${type} event:`, error);
  }
}

/**
 * 2. FETCH DASHBOARD DATA (Last 30 Days)
 */
export async function getCreatorAnalytics(userId) {
  try {
    await connectDB();
    
    // Get date from 30 days ago
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const dateLimit = pastDate.toISOString().split('T')[0];

    const stats = await Analytics.find({
      user: userId,
      date: { $gte: dateLimit }
    }).sort({ date: 1 }).lean();

    return JSON.parse(JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return [];
  }
}

/**
 * 3. LOG A PAGE VIEW (Global Site Analytics)
 */
export async function logPageView(path) {
  try {
    // Ignore static files and API routes
    if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) return;

    await connectDB();
    const dateStr = new Date().toISOString().split('T')[0];

    // Silently upsert the page view count for today
    await SiteAnalytics.findOneAndUpdate(
      { path, date: dateStr },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    );
  } catch (error) {
    // Fail silently so it never breaks the user experience
    console.error("Failed to log page view:", error.message);
  }
}