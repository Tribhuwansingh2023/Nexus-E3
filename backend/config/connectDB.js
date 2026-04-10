const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const MAX_RETRIES = 1;

let mongoServer;

const connectDB = async (retryCount = 0) => {
  try {
    // Attempt to connect to the provided Atlas cluster but fail very fast (3s)
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, 
    });
    console.log("✅ MongoDB connected successfully to remote cluster.");
  } catch (error) {
    console.error(`❌ Remote MongoDB connection failed:`, error.message);
    
    // Automatically fallback to local memory server
    console.log("⚠️ Starting fallback Local Memory Database to prevent app crashes...");
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ Connected to fallback Local Memory DB at ${mongoUri}`);
      console.log("   Note: Data will NOT be saved when you restart the server.");
    } catch (memError) {
      console.error("❌ Fallback Memory DB also failed:", memError.message);
    }
  }
};

module.exports = connectDB;
