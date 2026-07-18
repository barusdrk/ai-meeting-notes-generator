import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import auth, {
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  async (req, res) => {
    try {
      const { email, password } =
        req.body;

      if (!email || !password) {
        return res.status(400).json({
          error:
            "Email and password are required.",
        });
      }

      const existing =
        await User.findOne({
          email,
        });

      if (existing) {
        return res.status(409).json({
          error:
            "User already exists.",
        });
      }

      const hash =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          email,
          password: hash,
        });

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch {
      return res.status(500).json({
        error:
          "Registration failed.",
      });
    }
  }
);

router.post(
  "/login",
  async (req, res) => {
    try {
      const { email, password } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(401).json({
          error:
            "Invalid email or password.",
        });
      }

      const valid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!valid) {
        return res.status(401).json({
          error:
            "Invalid email or password.",
        });
      }

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch {
      return res.status(500).json({
        error:
          "Login failed.",
      });
    }
  }
);

router.get(
  "/me",
  auth,
  async (
    req: AuthRequest,
    res
  ) => {
    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    return res.json({
      id: user._id,
      email: user.email,
    });
  }
);

export default router;
