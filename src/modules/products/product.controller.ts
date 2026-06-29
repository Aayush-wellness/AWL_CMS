import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { logActivity } from "../activity/activity.service.js";
import {
	createProduct,
	deleteProduct,
	getProductById,
	getProducts,
	getPublicProductById,
	getPublicCategoriesWithProducts,
	updateProduct,
	createCategory,
	getCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
} from "./product.service.js";

// ── Product Controller Actions ─────────────────────────────────────────

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		const product = await createProduct(req.body, req.user.id);
		await logActivity(
			"product",
			"created",
			`Product '${product.title}' created`,
			`PROD-${product.id.slice(-4).toUpperCase()}`
		);
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
		await logActivity(
			"product",
			"updated",
			`Product '${product.title}' details updated`,
			`PROD-${product.id.slice(-4).toUpperCase()}`
		);
		successResponse(res, product, "Product updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const product = await deleteProduct(req.params.id as string);
		await logActivity(
			"product",
			"deleted",
			`Product '${product.title}' deleted`,
			`PROD-${product.id.slice(-4).toUpperCase()}`
		);
		successResponse(res, product, "Product deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

// ── Category Controller Actions ────────────────────────────────────────

export async function createCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}
		const category = await createCategory(req.body, req.user.id);
		successResponse(res, category, "Product category created successfully", STATUS_CODES.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function listCategoriesAction(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const result = await getCategories(req.query);
		successResponse(res, result, "Product categories fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function getCategoryByIdAction(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const category = await getCategoryById(req.params.id as string);
		successResponse(res, category, "Product category fetched successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function updateCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const category = await updateCategory(req.params.id as string, req.body);
		successResponse(res, category, "Product category updated successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

export async function removeCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const category = await deleteCategory(req.params.id as string);
		successResponse(res, category, "Product category deleted successfully", STATUS_CODES.OK);
	} catch (error) {
		next(error);
	}
}

// ── Public Controller Actions ──────────────────────────────────────────

export async function publicList(_req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const items = await getPublicCategoriesWithProducts();
		successResponse(res, items, "Active product categories and nested products fetched successfully", STATUS_CODES.OK);
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

// ── File Upload Action ─────────────────────────────────────────────────

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
