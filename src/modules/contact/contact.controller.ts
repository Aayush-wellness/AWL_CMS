import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import {
	deleteContactInquiry,
	getContactInquiries,
	getContactInquiryById,
	markInquiryAsRead,
	submitContactInquiry,
} from "./contact.service.js";

// ── Public ───────────────────────────────────────────────────────────────

export async function submit(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const inquiry = await submitContactInquiry(req.body);
		successResponse(res, inquiry, "Thank you! Your inquiry has been received.", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getContactInquiries(req.query);
		successResponse(res, result, "Contact inquiries fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const inquiry = await getContactInquiryById(req.params.id as string);
		successResponse(res, inquiry, "Contact inquiry fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const inquiry = await markInquiryAsRead(req.params.id as string);
		successResponse(res, inquiry, "Inquiry marked as read", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const inquiry = await deleteContactInquiry(req.params.id as string);
		successResponse(res, inquiry, "Contact inquiry deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}