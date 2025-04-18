import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes'

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/v1/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
