import { Request, Response, NextFunction } from "express";
import STATUS_CODES from "../utils/statusCodes.js";
import { errorResponse } from "../utils/apiResponse.js";
import { isAppError } from "../utils/errors.js";

export const errorHandler = async (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  console.error("Error Handler Middleware:", err);

  if (isAppError(err)) {
    errorResponse(res, err.message, err.errors, err.statusCode);
    return;
  }

  const message = err instanceof Error ? err.message : "Something went wrong";
  errorResponse(res, message, [], STATUS_CODES.SERVER_ERROR);
};