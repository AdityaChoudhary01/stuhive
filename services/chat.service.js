"use server";

import connectDB from "@/lib/db";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { generateUploadUrl, getR2PublicUrl } from "@/lib/r2"; 

export async function searchUsersForChat(query, currentUserId) {
  if (!query) return [];

  await connectDB();

  try {
    console.log(`🔍 Searching for: "${query}" | Excluding ID: ${currentUserId}`);

    const safeSearch = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = { $regex: safeSearch, $options: 'i' };

    const excludeId = mongoose.Types.ObjectId.isValid(currentUserId) 
      ? new mongoose.Types.ObjectId(currentUserId) 
      : currentUserId;

    const users = await User.find({
      _id: { $ne: excludeId }, 
      name: searchRegex
    })
    .select('name avatar')
    .limit(8)
    .lean();

    console.log(`✅ Found ${users.length} matching users.`);

    return users.map(u => ({
      ...u,
      _id: u._id.toString()
    }));

  } catch (error) {
    console.error("❌ Chat user search error:", error);
    return [];
  }
}

// ===============================
// 1️⃣ GET OR CREATE CONVERSATION
// ===============================
export async function getOrCreateConversation(userA, userB) {
  await connectDB();

  let convo = await Conversation.findOne({
    participants: { $all: [userA, userB] }
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [userA, userB]
    });
  }

  return convo;
}

// ===============================
// 🚀 GET R2 UPLOAD URL
// ===============================
export async function getChatPresignedUrl(fileName, fileType) {
  const ext = fileName.split('.').pop();
  const key = `chat/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;
  const uploadUrl = await generateUploadUrl(key, fileType);
  const publicUrl = getR2PublicUrl(key);
  
  return { uploadUrl, publicUrl };
}


// ===============================
// 2️⃣ SEND MESSAGE 
// ===============================
export async function sendMessage({ senderId, receiverId, content, imageUrl, fileUrl, fileName, replyTo }) {
  await connectDB();

  const convo = await getOrCreateConversation(senderId, receiverId);

  const message = await Message.create({
    conversation: convo._id,
    sender: senderId,
    content: content || "", 
    imageUrl,
    fileUrl,
    fileName,
    replyTo,
    readBy: [senderId]
  });

  convo.lastMessage = message._id;
  await convo.save();

  return {
    _id: message._id.toString(),
    conversationId: convo._id.toString(),
    sender: senderId,
    content: content || "",
    imageUrl,
    fileUrl,
    fileName,
    replyTo,
    createdAt: message.createdAt.toISOString(),
    readBy: [senderId]
  };
}

// ===============================
// 🔹 MARK CONVERSATION READ
// ===============================
export async function markConversationRead(conversationId, userId) {
  try {
    await connectDB();
    const result = await Message.updateMany(
      { 
        conversation: conversationId,
        sender: { $ne: userId }, 
        readBy: { $ne: userId }  
      },
      { $addToSet: { readBy: userId } }
    );
    return { success: true, updatedCount: result.modifiedCount };
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return { success: false, error: error.message };
  }
}

// ===============================
// 🔹 GET CONVERSATION MESSAGES 
// ===============================
export async function getConversationWithMessages(userA, userB) {
  await connectDB();

  let convo = await Conversation.findOne({
    participants: { $all: [userA, userB] }
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [userA, userB]
    });
  }

  const messages = await Message.find({
    conversation: convo._id
  })
    .sort({ createdAt: -1 }) 
    .limit(20)               
    .lean();

  const formattedMessages = messages.reverse().map(m => ({ 
    _id: m._id.toString(),
    sender: m.sender.toString(),
    content: m.content,
    imageUrl: m.imageUrl || null,
    fileUrl: m.fileUrl || null,
    fileName: m.fileName || null,
    replyTo: m.replyTo || null,
    readBy: m.readBy.map(id => id.toString()),
    edited: m.edited,
    deletedForEveryone: m.deletedForEveryone,
    // 🚀 THE FIX: Safely serialize the deeply nested ObjectIds inside reactions
    reactions: m.reactions ? m.reactions.map(r => ({
      emoji: r.emoji,
      userId: r.userId ? r.userId.toString() : null,
      _id: r._id ? r._id.toString() : null
    })) : [],
    createdAt: m.createdAt.toISOString()
  }));

  return {
    conversationId: convo._id.toString(),
    messages: formattedMessages
  };
}

export async function editMessage(messageId, newContent) {
  await connectDB();
  await Message.findByIdAndUpdate(messageId, {
    content: newContent,
    edited: true
  });
}

export async function deleteMessageForEveryone(messageId) {
  await connectDB();
  await Message.findByIdAndUpdate(messageId, {
    deletedForEveryone: true
  });
}

// ===============================
// 🔹 GET USER CONVERSATIONS
// ===============================
export async function getUserConversations(userId) {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const conversations = await Conversation.find({
    participants: userObjectId
  })
    .populate({
      path: "lastMessage",
      select: "content sender readBy createdAt imageUrl fileUrl" 
    })
    .populate({
      path: "participants",
      select: "name avatar"
    })
    .lean();

  return conversations.map(convo => {
    const otherUser = convo.participants.find(
      p => p._id.toString() !== userId
    );

    const lastMessage = convo.lastMessage;

    let unreadCount = 0;

    if (lastMessage) {
      const isSentByMe =
        lastMessage.sender.toString() === userId;

      const isRead =
        lastMessage.readBy?.some(
          id => id.toString() === userId
        );

      if (!isSentByMe && !isRead) {
        unreadCount = 1;
      }
    }

    return {
      conversationId: convo._id.toString(),
      user: {
        _id: otherUser._id.toString(),
        name: otherUser.name,
        avatar: otherUser.avatar
      },
      lastMessage: lastMessage?.content || (lastMessage?.imageUrl ? "🖼️ Image" : lastMessage?.fileUrl ? "📄 Document" : ""),
      lastMessageDate: lastMessage?.createdAt || null,
      unreadCount
    };
  });
}

export async function deleteConversation(conversationId) {
  await connectDB();

  await Message.deleteMany({
    conversation: conversationId
  });

  await Conversation.findByIdAndDelete(conversationId);

  return { success: true };
}

export async function toggleReaction(messageId, userId, emoji) {
  await connectDB();

  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (!message.reactions) {
    message.reactions = [];
  }

  const existing = message.reactions.find(
    r =>
      r.userId.toString() === userId.toString() &&
      r.emoji === emoji
  );

  if (existing) {
    message.reactions = message.reactions.filter(
      r =>
        !(
          r.userId.toString() === userId.toString() &&
          r.emoji === emoji
        )
    );
  } else {
    message.reactions.push({
      emoji,
      userId
    });
  }

  await message.save();

  return {
    messageId,
    reactions: message.reactions.map(r => ({
      emoji: r.emoji,
      userId: r.userId.toString()
    }))
  };
}


// ===============================
// 🔟 GET TOTAL UNREAD COUNT
// ===============================
export async function getUnreadCount(userId) {
  await connectDB();

  const conversations = await Conversation.find({
    participants: userId
  }).populate({
    path: "lastMessage",
    select: "sender readBy"
  });

  let total = 0;

  conversations.forEach(convo => {
    const last = convo.lastMessage;

    if (
      last &&
      last.sender.toString() !== userId &&
      !last.readBy?.map(id => id.toString()).includes(userId)
    ) {
      total += 1;
    }
  });

  return total;
}

// ===============================
// 🔹 GET OLDER MESSAGES
// ===============================
export async function getOlderMessages(conversationId, page = 2) {
  const MESSAGES_PER_PAGE = 20;
  
  await connectDB();

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * MESSAGES_PER_PAGE)
    .limit(MESSAGES_PER_PAGE)
    .lean();

  return messages.reverse().map(m => ({
    _id: m._id.toString(),
    sender: m.sender.toString(),
    content: m.content,
    imageUrl: m.imageUrl || null,
    fileUrl: m.fileUrl || null,
    fileName: m.fileName || null,
    replyTo: m.replyTo || null,
    readBy: m.readBy.map(id => id.toString()),
    edited: m.edited,
    deletedForEveryone: m.deletedForEveryone,
    // 🚀 THE FIX: Safely serialize the deeply nested ObjectIds inside reactions
    reactions: m.reactions ? m.reactions.map(r => ({
      emoji: r.emoji,
      userId: r.userId ? r.userId.toString() : null,
      _id: r._id ? r._id.toString() : null
    })) : [],
    createdAt: m.createdAt.toISOString()
  }));
}