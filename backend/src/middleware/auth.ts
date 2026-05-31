import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
