import express from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { validateRegister } from '../validators/user.validator';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

router.post('/register', validateRegister, validateRequest, register);
router.post('/', login);
router.post('/', logout);

export default router;
