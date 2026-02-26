import mongoose from 'mongoose';

const SiteAnalyticsSchema = new mongoose.Schema({
  path: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, // Format: "YYYY-MM-DD"
    required: true 
  },
  views: { 
    type: Number, 
    default: 0 
  }
});

// 🚀 CRITICAL: Compound unique index prevents duplicates and ensures ultra-fast daily aggregations.
SiteAnalyticsSchema.index({ path: 1, date: 1 }, { unique: true });

const SiteAnalytics = mongoose.models.SiteAnalytics || mongoose.model('SiteAnalytics', SiteAnalyticsSchema, 'StuHive_site_analytics');

export default SiteAnalytics;