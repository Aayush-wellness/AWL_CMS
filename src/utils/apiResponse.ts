import { Response } from "express";
import STATUS_CODES from "./statusCodes.js";

export function successResponse(
  res: Response,
  data: unknown,
  message = "Operation successful",
  statusCode = STATUS_CODES.OK,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: [],
  });
}

export function errorResponse(
  res: Response,
  message = "Something went wrong",
  errors: unknown[] = [],
  statusCode = STATUS_CODES.SERVER_ERROR,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
}