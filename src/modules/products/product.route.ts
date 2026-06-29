import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import {
	createProductValidator,
	updateProductValidator,
	createCategoryValidator,
	updateCategoryValidator,
} from "./product.validators.js";
import {
	create,
	getById,
	list,
	remove,
	update,
	createCategoryAction,
	listCategoriesAction,
	getCategoryByIdAction,
	updateCategoryAction,
	removeCategoryAction,
	uploadFile,
} from "./product.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// File Upload for main product image or thumbnails
router.post("/upload", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), upload.single("file"), uploadFile);

// Product Category CRUD (Admin only)
router.post("/categories", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(createCategoryValidator), createCategoryAction);
router.get("/categories", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), listCategoriesAction);
router.get("/categories/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getCategoryByIdAction);
router.patch("/categories/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(updateCategoryValidator), updateCategoryAction);
router.delete("/categories/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), removeCategoryAction);

// Products CRUD (Admin only)
router.post("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(createProductValidator), create);
router.get("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), list);
router.get("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getById);
router.patch("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(updateProductValidator), update);
router.delete("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), remove);

export default router;
