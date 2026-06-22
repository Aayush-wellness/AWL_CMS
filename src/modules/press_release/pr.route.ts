import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import { createPressReleaseValidator, updatePressReleaseValidator } from "./pr.validators.js";
import { create, getById, list, remove, update } from "./pr.controller.js";

const router = Router();

router.post("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(createPressReleaseValidator), create);
router.get("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), list);
router.get("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getById);
router.patch("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), validateRequest(updatePressReleaseValidator), update);
router.delete("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), remove);

export default router;
