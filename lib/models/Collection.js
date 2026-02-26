import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  university: {
    type: String,
    default: "",
    index: true
  },
  // 🚀 ADDED: Slug for SEO-friendly URLs (/collections/my-cool-bundle)
  slug: {
    type: String,
    unique: true,
    index: true
  },
  // 🚀 ADDED: Visibility Toggle
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
    index: true // Indexed because we will filter by 'public' in the Browse page
  },
  // 🚀 ADDED: Optional Description for SEO Meta tags on the public page
  description: {
    type: String,
    default: "",
    maxlength: 200
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, {
  timestamps: true
});

// ✅ Compound index: Ensures user can't have two collections with the same name
CollectionSchema.index({ user: 1, name: 1 });

/**
 * 🚀 AUTO-GENERATE SLUG
 * This runs every time a collection is created or the name is renamed.
 */
CollectionSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  // Create base slug
  let generatedSlug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens

  // Check for uniqueness (if another user has a collection with the same name)
  const CollectionModel = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
  const existing = await CollectionModel.findOne({ slug: generatedSlug });
  
  if (existing && existing._id.toString() !== this._id.toString()) {
    // If slug exists, append a short random string or timestamp
    generatedSlug = `${generatedSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  this.slug = generatedSlug;
  next();
});

const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema, 'StuHive_collections');

export default Collection;