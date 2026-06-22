import { Response } from 'express';
import STATUS_CODES from "./statusCodes.js";

export const sendResponse = (
  res: Response,
  success: boolean,
  data: unknown,
  message = "",
  statusCode = STATUS_CODES.OK,
  errors: unknown[] = []
) => {
  return res.status(statusCode).json({ success, message, data, errors });
};