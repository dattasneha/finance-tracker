import { use } from "react";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../utils/prismaClient";

const getTotalIncome = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await prisma.$queryRaw
    `SELECT total_income
    FROM user_financial_summary
    WHERE "userId" = ${userId}
    `;
    
    const totalIncome = result[0]?.total_income || 0;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    const userWithIncome = {
        ...user,
        totalIncome: totalIncome._sum.amount || 0
    };
    
    return res.status(200).json(new ApiResponse(userWithIncome, "Total income calculated successfully."));
});

const getTotalExpense = asyncHandler(async (req, res) => {   
    const userId = req.user.id;

    const result = await prisma.$queryRaw
    `SELECT total_expense
    FROM user_financial_summary
    WHERE "userId" = ${userId}
    `;

    const totalExpense = result[0]?.total_expense || 0;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    const userWithExpense = {
        ...user,
        totalExpense: totalExpense._sum.amount || 0
    };

    return res.status(200).json(new ApiResponse(userWithExpense, "Total expense calculated successfully."));
});

const getNetBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await prisma.$queryRaw
    `SELECT net_balance
    FROM user_financial_summary
    WHERE "userId" = ${userId}
    `;

    const netBalance = result[0]?.net_balance || 0;
    
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    const userWithBalance = {
        ...user,
        netBalance: netBalance < 0 ? 0 : netBalance
    };
    return res.status(200).json(new ApiResponse(userWithBalance, "Net balance calculated successfully."));
});

const getTotalByCategory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await prisma.transaction.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true }
    });
    
    const formattedResult = result.map(item => ({
        category: item.category,
        totalAmount: item._sum.amount || 0
    }));
    return res.status(200).json(new ApiResponse(formattedResult, "Total by category calculated successfully."));

});

const getRecentActivities = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const recentActivities = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10
    });

    return res.status(200).json(new ApiResponse(recentActivities, "Recent activities retrieved successfully."));

});
const getMonthlyTrends = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await prisma.$queryRaw
    `SELECT month,income,expense
    FROM monthly_trends
    WHERE "userId" = ${userId}
    ORDER BY month DESC
    LIMIT 12
    `;
    return res.status(200).json(new ApiResponse(result, "Monthly trends retrieved successfully."));
});
const getWeeklyTrends = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await prisma.$queryRaw
    `SELECT week,income,expense
    FROM weekly_trends
    WHERE "userId" = ${userId}
    ORDER BY week DESC
    LIMIT 12
    `;
    return res.status(200).json(new ApiResponse(result, "Weekly trends retrieved successfully."));
});

export {
  getTotalIncome,
  getTotalExpense,
  getNetBalance,
  getTotalByCategory,
  getRecentActivities,
  getMonthlyTrends,
  getWeeklyTrends
};
