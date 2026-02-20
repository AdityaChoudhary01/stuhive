import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside the Cloudflare/Deployment Dashboard.'
  );
}

/**
 * Global cache to prevent multiple connections during hot reloads or 
 * concurrent Serverless function invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 🛠️ CLOUDFLARE & AZURE COSMOS DB OPTIMIZED OPTIONS
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1, // High-Octane: Keeps a connection warm for Edge starts
      maxIdleTimeMS: 120000, // Azure/Cloudflare safe: Closes idle pipes early
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4, // Forces IPv4, which is often more stable in certain cloud regions
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('🚀 High-Octane DB Connection Established!');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise on failure so the next request can retry
    cached.promise = null;
    console.error('❌ Database Connection Error:', e.message);
    throw new Error('Database connection failed. Check your network whitelist or URI.');
  }

  return cached.conn;
}

export default connectDB;