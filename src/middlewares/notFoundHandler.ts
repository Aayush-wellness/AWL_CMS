import { Request, Response, NextFunction } from "express";
import STATUS_CODES from "../utils/statusCodes.js";
import { errorResponse } from "../utils/apiResponse.js";

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
    const msg = `Route not found: ${req.method} ${req.originalUrl}`;
    try {
        console.error(msg);
    } catch (e) {
        console.error(msg);
    }
    errorResponse(res, "Route not found", [msg], STATUS_CODES.NOT_FOUND);
    return;
};