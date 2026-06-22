import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import {
	createJob,
	deleteJob,
	getJobById,
	getJobs,
	getPublicJobById,
	getPublicJobs,
	updateJob,
} from "./job.service.js";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		const job = await createJob(req.body, req.user.id);
		successResponse(res, job, "Job post created successfully", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getJobs(req.query);
		successResponse(res, result, "Job posts fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const job = await getJobById(req.params.id as string);
		successResponse(res, job, "Job post fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const job = await updateJob(req.params.id as string, req.body);
		successResponse(res, job, "Job post updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const job = await deleteJob(req.params.id as string);
		successResponse(res, job, "Job post deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicList(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const items = await getPublicJobs();
		successResponse(res, items, "Published jobs fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicGetById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const job = await getPublicJobById(req.params.id as string);
		successResponse(res, job, "Job fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}
