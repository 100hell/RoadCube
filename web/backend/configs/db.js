import dotenv from "dotenv";
dotenv.config({});

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://chandansahu:ChandanSahuRoadcube123@cluster0.3bnr2c4.mongodb.net/roadcube-dev"
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    console.log("Mongo DB not connected: ", error.message);
    process.exit();
  }
};

export default connectDB;
