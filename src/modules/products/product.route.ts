import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import { createProductValidator, updateProductValidator } from "./product.validators.js";
import { create, getById, list, remove, update } from "./product.controller.js";

const router = Router();

router.post("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(createProductValidator), create);
router.get("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), list);
router.get("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getById);
router.patch("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(updateProductValidator), update);
router.delete("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), remove);

export default router;
