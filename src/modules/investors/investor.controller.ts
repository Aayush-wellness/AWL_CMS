import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import {
  createCategory,
  createDocument,
  deleteCategory,
  deleteDocument,
  getCategories,
  getCategoryById,
  getDocumentById,
  getDocuments,
  getPublicInvestorCategoriesWithDocs,
  updateCategory,
  updateDocument,
} from "./investor.service.js";

// --- Category Controller Actions ---

export async function createCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    const category = await createCategory(req.body, req.user.id);
    successResponse(res, category, "Investor category created successfully", STATUS_CODES.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function listCategoriesAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await getCategories(req.query);
    successResponse(res, result, "Investor categories fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryByIdAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await getCategoryById(req.params.id as string);
    successResponse(res, category, "Investor category fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await updateCategory(req.params.id as string, req.body);
    successResponse(res, category, "Investor category updated successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function removeCategoryAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await deleteCategory(req.params.id as string);
    successResponse(res, category, "Investor category deleted successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

// --- Document Controller Actions ---

export async function createDocumentAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    const doc = await createDocument(req.body, req.user.id);
    successResponse(res, doc, "Investor document created successfully", STATUS_CODES.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function listDocumentsAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await getDocuments(req.query);
    successResponse(res, result, "Investor documents fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function getDocumentByIdAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await getDocumentById(req.params.id as string);
    successResponse(res, doc, "Investor document fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function updateDocumentAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await updateDocument(req.params.id as string, req.body);
    successResponse(res, doc, "Investor document updated successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

export async function removeDocumentAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await deleteDocument(req.params.id as string);
    successResponse(res, doc, "Investor document deleted successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}

// --- Public Actions ---

export async function publicList(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await getPublicInvestorCategoriesWithDocs();
    successResponse(res, categories, "Active investor categories and documents fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}
