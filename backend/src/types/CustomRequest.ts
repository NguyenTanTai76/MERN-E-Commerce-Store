import { Request } from 'express';
import { TokenPayload } from './TokenPayload';

export interface CustomRequest extends Request {
  user?: TokenPayload;
}
