
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.URIDB;
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
    });
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
};

export default connectDB;
