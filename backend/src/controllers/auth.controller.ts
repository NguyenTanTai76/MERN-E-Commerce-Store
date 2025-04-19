import { Request, Response } from 'express';
import User from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.util';
import { redis } from '../config/redis';
import { TokenPayload } from '../types/TokenPayload';
import { storeRefreshToken } from '../utils/redis.util';

// Register
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'User already exists!' });
    return;
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser.toObject();

  res
    .status(201)
    .json({ message: 'Registered successfully', user: userWithoutPassword });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 🔍 Tìm người dùng theo email
    const user = await User.findOne({ email });

    // Nếu không tìm thấy hoặc sai mật khẩu
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Tạo payload chứa userId
    const payload: TokenPayload = { id: user._id as string };

    // Tạo access token (15 phút) và refresh token (7 ngày)
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Lưu refreshToken vào Redis với TTL 7 ngày
    await storeRefreshToken(payload.id, refreshToken);
    console.log('✅ Refresh token stored in Redis');

    // Lưu accessToken vào cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    // Lưu refreshToken vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Ẩn mật khẩu khi trả về client
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    // Giải mã refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded) {
      // Xóa token trong Redis (đăng xuất)
      await redis.del(`refresh_token:${decoded.id}`);
    }
  }

  // Xóa cookies ở client
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({ message: 'Logged out successfully' });
};

// Refresh token
export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  // Không có refreshToken -> từ chối
  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  // Giải mã refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }

  // Lấy refreshToken lưu trong Redis để đối chiếu
  const storedToken = await redis.get(`refresh_token:${decoded.id}`);

  // Nếu token không khớp -> không cấp mới accessToken
  if (storedToken !== refreshToken) {
    res
      .status(401)
      .json({ message: 'Refresh token does not match stored token' });
    return;
  }

  // Tạo accessToken mới
  const newAccessToken = generateAccessToken({ id: decoded.id });

  // Gửi lại accessToken trong cookie
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 phút
  });

  res.status(200).json({ message: 'Access token refreshed' });
};
