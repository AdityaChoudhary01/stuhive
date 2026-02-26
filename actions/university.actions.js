"use server";

import dbConnect from "@/lib/db";
import Note from "@/lib/models/Note"; 
import Collection from "@/lib/models/Collection";
import Request from "@/lib/models/Request";

export async function getUniversityHubData(slug) {
  try {
    await dbConnect();
    
    // Convert slug "mumbai-university" to "Mumbai University" regex
    const nameStr = slug.replace(/-/g, ' ');
    const uniRegex = new RegExp(nameStr, 'i');

    // 🚀 FIXED: Set limit to 12 for perfect grid alignments
    const limitNum = 12;

    const [notes, collections, requests] = await Promise.all([
      Note.find({ university: uniRegex }).sort({ viewCount: -1 }).limit(limitNum).populate('user', 'name avatar').lean(),
      
      Collection.find({ 
        $or: [{ name: uniRegex }, { university: uniRegex }], 
        visibility: 'public' 
      }).sort({ createdAt: -1 }).limit(limitNum).populate('user', 'name avatar').lean(),
      
      Request.find({ university: uniRegex, status: 'pending' }).sort({ createdAt: -1 }).limit(limitNum).populate('requester', 'name avatar').lean()
    ]);

    const formattedName = nameStr.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
      success: true,
      universityName: formattedName,
      stats: {
        noteCount: await Note.countDocuments({ university: uniRegex }),
        collectionCount: await Collection.countDocuments({ 
          $or: [{ name: uniRegex }, { university: uniRegex }], 
          visibility: 'public' 
        }),
        requestCount: await Request.countDocuments({ university: uniRegex })
      },
      notes: JSON.parse(JSON.stringify(notes)),
      collections: JSON.parse(JSON.stringify(collections)),
      requests: JSON.parse(JSON.stringify(requests))
    };
  } catch (error) {
    console.error("Error fetching university data:", error);
    return { success: false, universityName: slug, notes: [], collections: [], requests: [], stats: {} };
  }
}

export async function getTopUniversities() {
  try {
    await dbConnect();
    const topUnivs = await Note.aggregate([
      { $match: { university: { $ne: null, $ne: "" } } },
      { $group: { _id: "$university", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return topUnivs.map(u => ({
      name: u._id,
      slug: u._id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      count: u.count
    }));
  } catch (error) {
    console.error("Error fetching top universities:", error);
    return [];
  }
}

// 🚀 NEW: Server Action to handle Load More Pagination
export async function loadMoreUniversityData(slug, tab, page = 1, limit = 12) {
  try {
    await dbConnect();
    const nameStr = slug.replace(/-/g, ' ');
    const uniRegex = new RegExp(nameStr, 'i');
    const skip = (page - 1) * limit;

    if (tab === 'notes') {
      const notes = await Note.find({ university: uniRegex }).sort({ viewCount: -1 }).skip(skip).limit(limit).populate('user', 'name avatar').lean();
      return JSON.parse(JSON.stringify(notes));
    }
    
    if (tab === 'collections') {
      const collections = await Collection.find({ $or: [{ name: uniRegex }, { university: uniRegex }], visibility: 'public' })
        .sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name avatar').lean();
      return JSON.parse(JSON.stringify(collections));
    }
    
    if (tab === 'requests') {
      const requests = await Request.find({ university: uniRegex, status: 'pending' }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('requester', 'name avatar').lean();
      return JSON.parse(JSON.stringify(requests));
    }
    
    return [];
  } catch (error) {
    console.error("Error loading more data:", error);
    return [];
  }
}