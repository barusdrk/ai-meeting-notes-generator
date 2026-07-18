import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest
  extends Request {
  userId?: string;
}

export default function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header =
    req.headers.authorization;

  if (
    !header ||
    !header.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  const token = header.substring(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
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
