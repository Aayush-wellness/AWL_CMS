import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { getDashboardOverview } from "./activity.controller.js";

const router = Router();

router.get("/dashboard", authenticate(), authorize("SUPER_ADMIN", "ADMIN"), getDashboardOverview);

export default router;
