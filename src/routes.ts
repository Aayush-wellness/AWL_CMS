
import { Router } from "express";
import { Request, Response } from "express";
import { sendResponse } from "./utils/responseUtils.js";
import STATUS_CODES from "./utils/statusCodes.js";
import authRouter from "./modules/auth/auth.route.js";
import prRouter from "./modules/press_release/pr.route.js";
import publicRouter from "./modules/public/public.route.js";
import productRouter from "./modules/products/product.route.js";
import jobRouter from "./modules/jobs/job.route.js";
import applicationRouter from "./modules/applications/application.route.js";
import contactRouter from "./modules/contact/contact.route.js";
import investorRouter from "./modules/investors/investor.route.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  sendResponse(res, true, { message: "Welcome to the Backend!" }, "Welcome to the Backend!", STATUS_CODES.OK);
});

// Auth
router.use("/auth", authRouter);

// Admin modules
router.use("/pr", prRouter);
router.use("/products", productRouter);
router.use("/jobs", jobRouter);
router.use("/applications", applicationRouter);
router.use("/contact", contactRouter);
router.use("/investors", investorRouter);

// Public (no auth)
router.use("/public", publicRouter);

export default router;
