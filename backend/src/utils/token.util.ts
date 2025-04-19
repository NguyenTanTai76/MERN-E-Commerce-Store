import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types/TokenPayload';

dotenv.config(); // Load các biến môi trường từ file .env

// Lấy secret key từ biến môi trường để ký và xác thực JWT
const accessSecret = process.env.ACCESS_SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;

/**
 * Tạo Access Token với payload truyền vào (chứa thông tin user như id, v.v).
 * Thời gian sống: 15 phút.
 */
export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, accessSecret, { expiresIn: '15m' });
};

/**
 * Tạo Refresh Token với payload truyền vào.
 * Thời gian sống: 7 ngày.
 */
export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
};

/**
 * Xác thực Refresh Token.
 * Nếu token hợp lệ → trả về payload (user id,...).
 * Nếu token sai hoặc hết hạn → trả về null.
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, refreshSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
};

/**
 * Xác thực Access Token.
 * Nếu token hợp lệ → trả về payload.
 * Nếu token sai hoặc hết hạn → trả về null.
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, accessSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
};
