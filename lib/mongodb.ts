import dns from 'dns';
import mongoose from 'mongoose';

// Node's resolver can pick up a broken local DNS server (e.g. 127.0.0.1 from a
// VPN/proxy on this machine) which refuses the SRV lookup mongodb+srv:// needs.
// Force a known-good public resolver so the lookup succeeds regardless of OS DNS config.
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Define the connection cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;


// Initialize the cache on the global object to persist across hot reloads in development
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The first DNS SRV lookup of a fresh process can hit a one-time channel-init
// race right after dns.setServers() runs (seen on Windows) and fail even
// though the resolver is correctly configured. A short delay before retrying
// lets the channel finish switching over.
async function connectWithRetry(
  uri: string,
  options: mongoose.ConnectOptions,
  attempts = 3
): Promise<typeof mongoose> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await mongoose.connect(uri, options);
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(500 * attempt);
    }
  }
  throw new Error('Unreachable');
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Validate MongoDB URI exists
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const options = {
    bufferCommands: false, // Disable Mongoose buffering
  };

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    cached.promise = connectWithRetry(MONGODB_URI, options);
  }

  try {
    // Wait for the connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow a fresh attempt on the next call
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}


export default connectDB;