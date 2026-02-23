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
  reactions: {
    type: [
      {
        emoji: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    default: []
  },
  
  content: { type: String, required: false }, // Made false because a message might just be an image!
  
  // 🚀 NEW FIELDS FOR ATTACHMENTS & REPLIES
  imageUrl: { type: String, default: null },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  replyTo: {
    _id: String,
    content: String,
    sender: String
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