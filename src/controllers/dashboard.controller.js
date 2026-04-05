import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../utils/prismaClient.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
const getDashBoardSummary = asyncHandler(async (req, res) => {
    const dashboardSummary = await prisma.dashboardSummary.findMany();
    if(dashboardSummary.length === 0) {
        return res.status(200).json(new ApiResponse([], "No dashboard summary data available."));
    }
    return res.status(200).json(new ApiResponse(dashboardSummary, "Dashboard summary retrieved successfully."));
});
    
const getdashboardSummaryByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const dashboardSummary = await prisma.dashboardSummary.findUnique({
        where: { category }
    });
    if (!dashboardSummary) {
        return res.status(404).json(new ApiResponse({}, "Dashboard summary not found for the specified category."));
    }
    return res.status(200).json(new ApiResponse(dashboardSummary, "Dashboard summary retrieved successfully."));

});

const getRecentActivities = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const recentActivities = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10
    });
    if(recentActivities.length === 0) {
        return res.status(200).json(new ApiResponse([], "No recent activities available."));
    }

    return res.status(200).json(new ApiResponse(recentActivities, "Recent activities retrieved successfully."));

});
const getMonthlyTrends = asyncHandler(async (req, res) => {
    const monthlyTrends = await prisma.monthlyTrend.findMany({
    orderBy: { month: 'desc' },
    take: 10
    });
    if(monthlyTrends.length === 0) {
        return res.status(200).json(new ApiResponse([], "No monthly trends data available."));
    }
    return res.status(200).json(new ApiResponse(monthlyTrends, "Monthly trends retrieved successfully."));
});

const getWeeklyTrends = asyncHandler(async (req, res) => {
    const weeklyTrends = await prisma.weeklyTrend.findMany({
    orderBy: { week: 'desc' },
    take: 10
    });
    if(weeklyTrends.length === 0) {
        return res.status(200).json(new ApiResponse([], "No weekly trends data available."));
    }
    return res.status(200).json(new ApiResponse(weeklyTrends, "Weekly trends retrieved successfully."));
});

export {
    getDashBoardSummary,
    getdashboardSummaryByCategory,
    getRecentActivities,
    getMonthlyTrends,
    getWeeklyTrends
};
