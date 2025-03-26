import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://jenanfaraj4:jenan.2004@cluster0.65uhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log("🔗 Trying to connect to MongoDB...");
  if (cached.conn) {
    console.log("✅ Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🚀 Connecting to database...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("🎉 MongoDB Connected!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
