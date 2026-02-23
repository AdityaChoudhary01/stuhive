import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // 🚀 NEW: Make content optional so users can send just an image
  content: { type: String, default: "" }, 
  
  // 🚀 NEW: Store the R2 Image URL
  imageUrl: { type: String, default: null },

  // 🚀 NEW: WhatsApp-style Reply Data
  replyTo: { 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },

  reactions: {
    type: [
      {
        emoji: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    default: []
  },
  readBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  edited: { type: Boolean, default: false },
  deletedForEveryone: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema, 'StuHive_messages');