import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse.js";
import STATUS_CODES from "../../utils/statusCodes.js";
import { getDashboardStats, getRecentActivities } from "./activity.service.js";

export async function getDashboardOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getDashboardStats();
    const activities = await getRecentActivities(10);
    successResponse(res, { stats, activities }, "Dashboard overview fetched successfully", STATUS_CODES.OK);
  } catch (error) {
    next(error);
  }
}
