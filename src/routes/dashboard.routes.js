import { Router } from "express";
import { getTotalIncome, getTotalExpenses, getNetWorth, getRecentActivities, getMonthlyTrends, getWeeklyTrends } from "../controllers/dashboard.controller.js";
import { verifyUserJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = Router();

router.get("/dashboard", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getDashBoardSummary);
router.get("/dashboard/category/:category", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getdashboardSummaryByCategory);
router.get("/dashboard/recent-activities", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getRecentActivities);
router.get("/dashboard/monthly-trends", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getMonthlyTrends);
router.get("/dashboard/weekly-trends", verifyUserJwt, authorizeRoles("VIEWER", "EDITOR", "ADMIN"), getWeeklyTrends);