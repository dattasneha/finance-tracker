-- CreateTable
CREATE TABLE "DashboardSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalExpense" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyTrend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expense" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MonthlyTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyTrend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expense" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "WeeklyTrend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSummary_userId_key" ON "DashboardSummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyTrend_userId_month_key" ON "MonthlyTrend"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyTrend_userId_week_key" ON "WeeklyTrend"("userId", "week");

-- AddForeignKey
ALTER TABLE "DashboardSummary" ADD CONSTRAINT "DashboardSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyTrend" ADD CONSTRAINT "MonthlyTrend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyTrend" ADD CONSTRAINT "WeeklyTrend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
