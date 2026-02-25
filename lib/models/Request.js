import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  university: { type: String, required: true, index: true }, // Good for filtering
  subject: { type: String, required: true },
  
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  status: { 
    type: String, 
    enum: ["pending", "fulfilled"], 
    default: "pending",
    index: true 
  },
  
  // If fulfilled, link to the note and the user who helped
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fulfillmentNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);