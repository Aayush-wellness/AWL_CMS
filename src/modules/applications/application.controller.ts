import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import {
	deleteApplication,
	getApplicationById,
	getApplications,
	submitApplication,
	updateApplicationStatus,
} from "./application.service.js";
import { ApplicationStatus } from "@prisma/client";

export async function submit(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const application = await submitApplication(req.body);
		successResponse(res, application, "Application submitted successfully", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getApplications(req.query);
		successResponse(res, result, "Applications fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const application = await getApplicationById(req.params.id as string);
		successResponse(res, application, "Application fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const { status, notes } = req.body as { status: ApplicationStatus; notes?: string };
		const application = await updateApplicationStatus(req.params.id as string, status, notes);
		successResponse(res, application, "Application status updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		await deleteApplication(req.params.id as string);
		successResponse(res, null, "Application deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}
