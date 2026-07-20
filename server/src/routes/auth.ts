import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import auth, {
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn: "7d",
    }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        error: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = createToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Registration failed.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const token = createToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Login failed.",
    });
  }
});

router.get(
  "/me",
  auth,
  async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }

      return res.json({
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Unable to fetch user.",
      });
    }
  }
);

export default router;
