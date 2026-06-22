import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import { submitApplicationValidator, updateApplicationStatusValidator } from "./application.validators.js";
import { getById, list, remove, submit, updateStatus } from "./application.controller.js";

const router = Router();

// Public — anyone can submit an application (careers form)
router.post("/", validateRequest(submitApplicationValidator), submit);

// Admin — protected routes
router.get("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), list);
router.get("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getById);
router.patch(
	"/:id/status",
	authenticate(),
	authorize("SUPER_ADMIN", "ADMIN"),
	validateRequest(updateApplicationStatusValidator),
	updateStatus,
);
router.delete("/:id", authenticate(), authorize("SUPER_ADMIN"), remove);

export default router;
