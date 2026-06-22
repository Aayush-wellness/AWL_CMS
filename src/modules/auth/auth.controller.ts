import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import { login as loginService, getCurrentUser } from "./auth.service.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await loginService(req.body);
		successResponse(res, result, "Login successful", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		const user = await getCurrentUser(req.user.id);
		successResponse(res, user, "Current user fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}