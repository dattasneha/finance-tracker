import { Router } from "express";
import { getDashBoardSummary,getdashboardSummaryByCategory, getRecentActivities, getMonthlyTrends, getWeeklyTrends } from "../controllers/dashboard.controller.js";
import { verifyUserJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = Router();

router.get("/", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getDashBoardSummary);
router.get("/:category", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getdashboardSummaryByCategory);
router.get("/recent-activities", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getRecentActivities);
router.get("/monthly-trends", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getMonthlyTrends);
router.get("/weekly-trends", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getWeeklyTrends);

export default router;