import { Request, Response } from 'express';
import { hashPassword } from '../utils/bcrypt.util';
import User from '../models/user.model';

// Hàm đăng ký người dùng
export const register = async (req: Request, res: Response) => {
  try {
    // Lấy dữ liệu người dùng gửi lên
    const { username, email, password } = req.body;

    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists!' });
      return;
    }

    // Mã hóa mật khẩu bằng bcrypt
    const hashedPassword = await hashPassword(password);

    // Tạo mới một user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Lưu vào cơ sở dữ liệu
    const savedUser = await newUser.save();

    // Không trả password về cho client => xoá password khỏi object
    const { password: _, ...userDataWithoutPassword } = savedUser.toObject();

    // Trả lại thông tin user đã đăng ký (không có password)
    res.status(201).json({
      message: 'Register successful',
      data: userDataWithoutPassword,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Hàm đăng nhập người dùng
export const login = async (req: Request, res: Response) => {};

// Hàm đăng xuất người dùng
export const logout = async (req: Request, res: Response) => {};
