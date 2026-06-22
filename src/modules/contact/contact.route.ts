import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import { submitContactValidator } from "./contact.validator.js";
import { getById, list, markAsRead, remove, submit } from "./contact.controller.js";

const router = Router();

// Public — website contact form submission
router.post("/", validateRequest(submitContactValidator), submit);

// Admin — protected routes
router.get("/", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), list);
router.get("/:id", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getById);
router.patch("/:id/read", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), markAsRead);
router.delete("/:id", authenticate(), authorize("SUPER_ADMIN"), remove);

export default router;