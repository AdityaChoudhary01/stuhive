"use server";

import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { revalidatePath } from "next/cache";

// 🚀 INTERNAL USE: Call this from other server actions to trigger a notification
export async function createNotification({ recipientId, actorId, type, message, link }) {
  await connectDB();
  try {
    await Notification.create({
      recipient: recipientId,
      actor: actorId || null,
      type,
      message,
      link,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { success: false, error: error.message };
  }
}

// 🚀 FRONTEND USE: Fetch notifications for the bell (Quick Preview)
export async function getUserNotifications(userId, limit = 10) {
  await connectDB();
  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return { 
      success: true, 
      notifications: JSON.parse(JSON.stringify(notifications)), 
      unreadCount 
    };
  } catch (error) {
    return { success: false, notifications: [], unreadCount: 0 };
  }
}

// 🚀 FRONTEND USE: Mark a single notification as read
export async function markNotificationAsRead(notificationId) {
  await connectDB();
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 🚀 FRONTEND USE: Mark all as read
export async function markAllNotificationsAsRead(userId) {
  await connectDB();
  try {
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ============================================================================
// 🚀 NEW FUNCTIONS FOR THE DEDICATED NOTIFICATIONS PAGE
// ============================================================================

// 🚀 FRONTEND USE: Get Paginated Notifications for the dedicated page
export async function getPaginatedNotifications(userId, page = 1, limit = 20) {
  await connectDB();
  try {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return { 
      success: true, 
      notifications: JSON.parse(JSON.stringify(notifications)), 
      total,
      totalPages: Math.ceil(total / limit),
      unreadCount
    };
  } catch (error) {
    return { success: false, notifications: [], total: 0, totalPages: 0, unreadCount: 0 };
  }
}

// 🚀 FRONTEND USE: Permanently delete all notifications for a user
export async function clearAllNotifications(userId) {
  await connectDB();
  try {
    await Notification.deleteMany({ recipient: userId });
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 🚀 FRONTEND USE: Delete a single notification
export async function deleteNotification(notificationId) {
  await connectDB();
  try {
    await Notification.findByIdAndDelete(notificationId);
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}