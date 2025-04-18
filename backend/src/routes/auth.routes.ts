import express from 'express';
import { login, logout, register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/', register);
router.post('/', login);
router.post('/', logout);

export default router;
