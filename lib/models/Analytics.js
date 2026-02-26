import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: String, // Format: "YYYY-MM-DD" for perfect daily grouping
    required: true 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  downloads: { 
    type: Number, 
    default: 0 
  }
});

// 🚀 CRITICAL FOR PERFORMANCE: Compound index ensures blazing-fast lookups 
// and prevents duplicate entries for the same user on the same day.
AnalyticsSchema.index({ user: 1, date: 1 }, { unique: true });

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema, 'StuHive_analytics');

export default Analytics;