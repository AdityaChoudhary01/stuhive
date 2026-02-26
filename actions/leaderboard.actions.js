"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

// 🚀 1. Fetch Global Top Contributors
export async function getGlobalLeaderboard(limit = 10) {
  try {
    await dbConnect();
    
    const topUsers = await User.find({ 
        $or: [
            { hivePoints: { $gt: 0 } }, 
            { noteCount: { $gt: 0 } },
            { blogCount: { $gt: 0 } } // Also include people who only blogged
        ] 
      })
      // 🚀 FIXED: Added blogCount to the selection!
      .select("name avatar university hivePoints badges noteCount blogCount")
      .sort({ hivePoints: -1, noteCount: -1 }) 
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(topUsers));
  } catch (error) {
    console.error("Failed to fetch global leaderboard:", error);
    return [];
  }
}

// ... (keep getUniversityLeaderboard and awardHivePoints the same)

// 🚀 2. Fetch Local University Leaderboard
export async function getUniversityLeaderboard(universityName, limit = 10) {
  try {
    await dbConnect();
    // Case-insensitive exact match
    const uniRegex = new RegExp(`^${universityName}$`, 'i');

    const topLocalUsers = await User.find({ university: uniRegex, hivePoints: { $gt: 0 } })
      .select("name avatar hivePoints badges noteCount")
      .sort({ hivePoints: -1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(topLocalUsers));
  } catch (error) {
    console.error("Failed to fetch local leaderboard:", error);
    return [];
  }
}

// 🚀 3. Engine Tool: Add points to a user
export async function awardHivePoints(userId, points) {
  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { $inc: { hivePoints: points } });
    return true;
  } catch (error) {
    console.error("Failed to award points:", error);
    return false;
  }
}