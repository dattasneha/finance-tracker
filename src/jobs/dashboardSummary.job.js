import cron from "node-cron";
import { prisma } from "../utils/prismaClient.js";

export const dashBoardSummaryJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const groupedTransactions = await prisma.transaction.groupBy({
        by: ["category", "type"],
        _sum: { amount: true },
        where: {
          isDeleted: false
        }
      });
      const categories = [...new Set(groupedTransactions.map(group => group.category))];
      for (const category of categories) {
        const income = groupedTransactions.find(group => group.category === category && group.type === "INCOME");
        const expense = groupedTransactions.find(group => group.category === category && group.type === "EXPENSE");
        const netBalance = (income?._sum.amount || 0) - (expense?._sum.amount || 0);

        await prisma.dashboardSummary.upsert({
          where: { category },
          update: {
            totalIncome: income?._sum.amount || 0,  
            totalExpense: expense?._sum.amount || 0,
            netBalance: netBalance < 0 ? 0 : netBalance
          },
          create: {
            category,
            totalIncome: income?._sum.amount || 0,
            totalExpense: expense?._sum.amount || 0,
            netBalance: netBalance < 0 ? 0 : netBalance
          }
        })  
      }

      const transactionByDate = await prisma.transaction.groupBy({
        by: ["category","type", "date"],
        _sum: { amount: true },
        where: {
          isDeleted: false
        }
      });

      const dates = [...new Set(transactionByDate.map(group => group.date.toISOString().split("T")[0]))];
      const monthlyMap = {};
      const weeklyMap = {};
      for (const row of dates) {
        const date = new Date(row.date);

        const month = new Date(date.getFullYear(), date.getMonth(), 1);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());

        const monthKey = `${row.category}-${month.toISOString()}`;
        const weekKey = `${row.category}-${weekStart.toISOString()}`;
        
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { category: row.category, month, income: 0, expense: 0 };
        }
        if (row.type === "INCOME") {
          monthlyMap[monthKey].income += row._sum.amount || 0;
        }

        if (row.type === "EXPENSE") {
          monthlyMap[monthKey].expense += row._sum.amount || 0;
        }
        if (!weeklyMap[weekKey]) {
          weeklyMap[weekKey] = { category: row.category, weekStart, income: 0, expense: 0 };
        }
        if (row.type === "INCOME") {
          weeklyMap[weekKey].income += row._sum.amount || 0;
        }
        if (row.type === "EXPENSE") {
          weeklyMap[weekKey].expense += row._sum.amount || 0;
        }
      }

      for (const key in monthlyMap) {
        const { category, month, income, expense } = monthlyMap[key];
        await prisma.monthlyTrend.upsert({
          where: { category, month },
          update: { income, expense },
          create: { category, month, income, expense }
        });
      }

      for (const key in weeklyMap) {
        const { category, weekStart, income, expense } = weeklyMap[key];
        await prisma.weeklyTrend.upsert({
          where: { category, weekStart },
          update: { income, expense },
          create: { category, weekStart, income, expense }
        });
      }

      console.log("Dashboard summaries updated.");

    } catch (error) {
      console.error("Error updating dashboard summaries:", error);
    }
  });
};