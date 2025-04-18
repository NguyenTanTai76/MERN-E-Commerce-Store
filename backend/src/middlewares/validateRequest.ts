import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Middleware để kiểm tra lỗi validation
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
