import { Router } from "express";
import { publicGetBySlug, publicList as publicPrList } from "../press_release/pr.controller.js";
import { publicList as publicProductList, publicGetById as publicProductGetById } from "../products/product.controller.js";
import { publicList as publicJobList, publicGetById as publicJobGetById } from "../jobs/job.controller.js";
import { publicList as publicInvestorList } from "../investors/investor.controller.js";

const router = Router();

// Press Releases
router.get("/press-releases", publicPrList);
router.get("/press-releases/:slug", publicGetBySlug);

// Products
router.get("/products", publicProductList);
router.get("/products/:id", publicProductGetById);

// Jobs (for careers page)
router.get("/jobs", publicJobList);
router.get("/jobs/:id", publicJobGetById);

// Investors (for documents page)
router.get("/investors", publicInvestorList);

export default router;