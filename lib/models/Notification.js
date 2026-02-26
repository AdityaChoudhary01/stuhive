import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // 🚀 Indexed for lightning-fast queries
  },
  actor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // (Optional) The person who triggered the notification
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['REQUEST_FULFILLED', 'FEATURED', 'MILESTONE', 'SYSTEM'] 
  },
  message: { 
    type: String, 
    required: true 
  },
  link: { 
    type: String // The URL to redirect to when clicked
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);