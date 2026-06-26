import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
  createCategoryValidator,
  createDocumentValidator,
  updateCategoryValidator,
  updateDocumentValidator,
} from "./investor.validators.js";
import {
  createCategoryAction,
  createDocumentAction,
  getCategoryByIdAction,
  getDocumentByIdAction,
  listCategoriesAction,
  listDocumentsAction,
  removeCategoryAction,
  removeDocumentAction,
  updateCategoryAction,
  updateDocumentAction,
} from "./investor.controller.js";

const router = Router();

// --- Category Routes ---
router.post(
  "/categories",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  validateRequest(createCategoryValidator),
  createCategoryAction
);
router.get(
  "/categories",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  listCategoriesAction
);
router.get(
  "/categories/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  getCategoryByIdAction
);
router.patch(
  "/categories/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  validateRequest(updateCategoryValidator),
  updateCategoryAction
);
router.delete(
  "/categories/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  removeCategoryAction
);

// --- Document Routes ---
router.post(
  "/documents",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  validateRequest(createDocumentValidator),
  createDocumentAction
);
router.get(
  "/documents",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  listDocumentsAction
);
router.get(
  "/documents/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  getDocumentByIdAction
);
router.patch(
  "/documents/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  validateRequest(updateDocumentValidator),
  updateDocumentAction
);
router.delete(
  "/documents/:id",
  authenticate(),
  authorize("SUPER_ADMIN", "ADMIN"),
  removeDocumentAction
);

export default router;
