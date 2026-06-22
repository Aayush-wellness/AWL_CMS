import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import {
	createProduct,
	deleteProduct,
	getProductById,
	getProducts,
	getPublicProductById,
	getPublicProducts,
	updateProduct,
} from "./product.service.js";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		const product = await createProduct(req.body, req.user.id);
		successResponse(res, product, "Product created successfully", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getProducts(req.query);
		successResponse(res, result, "Products fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const product = await getProductById(req.params.id as string);
		successResponse(res, product, "Product fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const product = await updateProduct(req.params.id as string, req.body);
		successResponse(res, product, "Product updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const product = await deleteProduct(req.params.id as string);
		successResponse(res, product, "Product deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicList(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const category = req.query.category as string | undefined;
		const items = await getPublicProducts(category);
		successResponse(res, items, "Products fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function publicGetById(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const product = await getPublicProductById(req.params.id as string);
		successResponse(res, product, "Product fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}
