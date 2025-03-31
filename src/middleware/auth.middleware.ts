// src/utils/token-validator.ts
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export function validateToken(req: Request): { success: boolean; userId?: number; status?: number; message?: string } {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      status: 401,
      message: 'Authorization token missing',
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    return {
      success: true,
      userId: decoded.userId,
    };
  } catch (error) {
    return {
      success: false,
      status: 403,
      message: 'Invalid token',
    };
  }
}
