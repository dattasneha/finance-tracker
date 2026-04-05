import cron from "node-cron";
import { prisma } from "../utils/prismaClient.js";

export const dashBoardSummaryJob = () => {
  cron.schedule(process.env.JOB_SCHEDULE || "*/5 * * * *", async () => {
    try {
      // -------- DASHBOARD SUMMARY --------
      const groupedTransactions = await prisma.transaction.groupBy({
        by: ["category", "type"],
        _sum: { amount: true },
        where: { isDeleted: false }
      });

      const categories = [...new Set(groupedTransactions.map(g => g.category))];

      for (const category of categories) {
        const income = groupedTransactions.find(g => g.category === category && g.type === "INCOME");
        const expense = groupedTransactions.find(g => g.category === category && g.type === "EXPENSE");
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
        });
      }

      // -------- MONTHLY & WEEKLY TRENDS --------
      const transactionByDate = await prisma.transaction.groupBy({
        by: ["category", "type", "date", "createdAt"],
        _sum: { amount: true },
        where: { isDeleted: false }
      });

      const monthlyMap = {};
      const weeklyMap = {};

      for (const row of transactionByDate) {
      
        let date = row.date ? new Date(row.date) : new Date(row.createdAt);
        if (isNaN(date.getTime())) {
          console.warn("Skipping transaction due to invalid date:", row);
          continue;
        }

        const month = new Date(date.getFullYear(), date.getMonth(), 1);

        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());

        const monthKey = `${row.category}-${month.toISOString()}`;
        const weekKey = `${row.category}-${weekStart.toISOString()}`;

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { category: row.category, month, income: 0, expense: 0 };
        }
        if (row.type === "INCOME") monthlyMap[monthKey].income += row._sum.amount || 0;
        if (row.type === "EXPENSE") monthlyMap[monthKey].expense += row._sum.amount || 0;

        if (!weeklyMap[weekKey]) {
          weeklyMap[weekKey] = { category: row.category, weekStart, income: 0, expense: 0 };
        }
        if (row.type === "INCOME") weeklyMap[weekKey].income += row._sum.amount || 0;
        if (row.type === "EXPENSE") weeklyMap[weekKey].expense += row._sum.amount || 0;
      }

      for (const key in monthlyMap) {
        const { category, month, income, expense } = monthlyMap[key];
        await prisma.monthlyTrend.upsert({
          where: { category_month: { category, month } },
          update: { income, expense },
          create: { category, month, income, expense }
        });
      }

      for (const key in weeklyMap) {
        const { category, weekStart, income, expense } = weeklyMap[key];
        await prisma.weeklyTrend.upsert({
          where: { category_week: { category, week: weekStart } },
          update: { income, expense },
          create: { category, week: weekStart, income, expense }
        });
      }

      console.log("Dashboard summaries updated successfully.");

    } catch (error) {
      console.error("Error updating dashboard summaries:", error);
    }
  });
};