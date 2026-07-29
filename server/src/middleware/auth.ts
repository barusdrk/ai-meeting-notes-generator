import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  organizationId?: string;
  organizationRole?: string;
}

export default function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET missing.");
    }

    const payload = jwt.verify(token, secret) as {
      userId: string;
    };

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token.",
    });
  }
}
