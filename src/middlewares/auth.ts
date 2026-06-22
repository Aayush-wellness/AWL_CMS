import type { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "@root/prisma.js";
import { AppError } from "../utils/errors.js";
import { verifyJwtToken } from "../utils/jwt.js";

function readBearerToken(header?: string): string {
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = header.slice(7).trim();
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  return token;
}

export function authenticate(): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = readBearerToken(req.headers.authorization);
      const payload = verifyJwtToken(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new AppError("Unauthorized", 401);
      }

      req.user = user;
      next();
    } catch (error) {
      next(error instanceof AppError ? error : new AppError("Unauthorized", 401));
    }
  };
}

export function authorize(...roles: Array<string>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new AppError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
