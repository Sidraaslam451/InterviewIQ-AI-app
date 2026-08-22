import mongoose from "mongoose";

// Serverless environments (Vercel) mein har request ek naya function
// instance ho sakta hai. Agar hum har baar naya connection banayein,
// MongoDB Atlas ki connection limit jaldi khatam ho jaati hai.
// Isliye hum connection ko "cache" karte hain — agar already connected
// hain, wahi reuse karte hain.

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // agla attempt fresh se try kare
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }

  return cached.conn;
};

export default connectDB;