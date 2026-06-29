import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { logActivity } from "../activity/activity.service.js";
import {
	createPressRelease,
	deletePressRelease,
	getPressReleaseById,
	getPressReleases,
	getPublicPressReleaseBySlug,
	getPublicPressReleases,
	updatePressRelease,
} from "./pr.service.js";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		const pressRelease = await createPressRelease(req.body, req.user.id);
		await logActivity(
			"press",
			pressRelease.isPublished ? "published" : "created",
			`Press release '${pressRelease.title}' ${pressRelease.isPublished ? "published" : "created"}`,
			`PR-${pressRelease.id.slice(-4).toUpperCase()}`
		);
		successResponse(res, pressRelease, "Press release created successfully", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getPressReleases(req.query);
		successResponse(res, result, "Press releases fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const pressRelease = await getPressReleaseById(req.params.id as string);
		successResponse(res, pressRelease, "Press release fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const pressRelease = await updatePressRelease(req.params.id as string, req.body);
		await logActivity(
			"press",
			pressRelease.isPublished ? "published" : "updated",
			`Press release '${pressRelease.title}' ${pressRelease.isPublished ? "published" : "updated"}`,
			`PR-${pressRelease.id.slice(-4).toUpperCase()}`
		);
		successResponse(res, pressRelease, "Press release updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const pressRelease = await deletePressRelease(req.params.id as string);
		await logActivity(
			"press",
			"deleted",
			`Press release '${pressRelease.title}' deleted`,
			`PR-${pressRelease.id.slice(-4).toUpperCase()}`
		);
		successResponse(res, pressRelease, "Press release deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicList(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const items = await getPublicPressReleases();
		successResponse(res, items, "Published press releases fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicGetBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const pressRelease = await getPublicPressReleaseBySlug(req.params.slug as string);
		successResponse(res, pressRelease, "Press release fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.file) {
			throw new Error("No file uploaded");
		}
		const url = await uploadToCloudinary(req.file);
		successResponse(res, { url }, "File uploaded successfully to Cloudinary", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}
