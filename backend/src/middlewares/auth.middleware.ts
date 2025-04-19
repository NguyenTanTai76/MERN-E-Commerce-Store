import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.util';
import { CustomRequest } from '../types/CustomRequest';

export const verifyToken = (
  req: CustomRequest, // CustomRequest là Request mở rộng có thêm trường `user`
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken; // Lấy access token từ cookie

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const payload = verifyAccessToken(token); // Giải mã và xác minh token
  if (!payload) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = payload; // Gắn thông tin người dùng vào request để sử dụng ở các middleware / route tiếp theo
  next(); // Cho phép tiếp tục xử lý request
};
