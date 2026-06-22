import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validate.js";
import { loginValidator } from "./auth.validators.js";
import { login, me } from "./auth.controller.js";

const router = Router();

router.post("/login", validateRequest(loginValidator), login);
router.get("/me", authenticate(), me);

export default router;