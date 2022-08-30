import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    jwt.verify(authorization as string, process.env.JWT_SECRET || 'jwt_secret');
    return next();
  } catch (err) {
    return res.status(404).json({ messagem: 'Token not found' });
  }
};

export default validateToken;
