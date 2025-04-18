import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connect to MongoDB successful!');
  } catch (error) {
    console.error('Connect to MongoDB failed!', error);
    process.exit(1);
  }
};

export default connectDB;
