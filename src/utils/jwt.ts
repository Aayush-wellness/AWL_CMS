// src/utils/jwt.ts

import jwt from "jsonwebtoken";
import type { JwtAuthPayload } from "../modules/auth/auth.types.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export const signJwtToken = (payload: JwtAuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyJwtToken = (token: string): JwtAuthPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtAuthPayload;
};