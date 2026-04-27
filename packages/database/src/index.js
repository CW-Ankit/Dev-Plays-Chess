import mongoose from "mongoose";
export * from "./models/User.js";
export * from "./models/Game.js";

export const connectDatabase = async (uri) => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
