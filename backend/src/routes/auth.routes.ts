import express from 'express';
import { login, logout, refresh, register } from '../controllers/auth.controller';
import { validateRegister } from '../validators/user.validator';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', validateRegister, validateRequest, register);

// Đăng nhập
router.post('/login', login);

// Đăng xuất
router.post('/logout', logout);

router.post('/refresh-token', refresh);


export default router;
