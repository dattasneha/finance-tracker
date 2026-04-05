import { use } from "react";
import asyncHandler from "../utils/asyncHandler";

const getTotalIncome = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const totalIncome = await prisma.transaction.aggregate({
        where: { userId, type: "INCOME" },
        _sum: { amount: true }
    });

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
    const totalExpense = await prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE" },
        _sum: { amount: true }
    });

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
    const totalIncome = await prisma.transaction.aggregate({
        where: { userId, type: "INCOME" },
        _sum: { amount: true }
    });
    const totalExpense = await prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE" },
        _sum: { amount: true }
    });
    const netBalance = (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0);
    
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
});
const getRecentActivities = asyncHandler(async (req, res) => {});
const getMonthlyTrends = asyncHandler(async (req, res) => {});
const getWeeklyTrends = asyncHandler(async (req, res) => {});

export {
  getTotalIncome,
  getTotalExpense,
  getNetBalance,
  getTotalByCategory,
  getRecentActivities,
  getMonthlyTrends,
  getWeeklyTrends
};
