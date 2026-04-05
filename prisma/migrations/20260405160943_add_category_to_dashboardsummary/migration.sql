/*
  Warnings:

  - You are about to drop the column `userId` on the `DashboardSummary` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MonthlyTrend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WeeklyTrend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category]` on the table `DashboardSummary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category,month]` on the table `MonthlyTrend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category,week]` on the table `WeeklyTrend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `DashboardSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `MonthlyTrend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `WeeklyTrend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DashboardSummary" DROP CONSTRAINT "DashboardSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyTrend" DROP CONSTRAINT "MonthlyTrend_userId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyTrend" DROP CONSTRAINT "WeeklyTrend_userId_fkey";

-- DropIndex
DROP INDEX "DashboardSummary_userId_key";

-- DropIndex
DROP INDEX "MonthlyTrend_userId_month_key";

-- DropIndex
DROP INDEX "WeeklyTrend_userId_week_key";

-- AlterTable
ALTER TABLE "DashboardSummary" DROP COLUMN "userId",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyTrend" DROP COLUMN "userId",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyTrend" DROP COLUMN "userId",
ADD COLUMN     "category" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSummary_category_key" ON "DashboardSummary"("category");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyTrend_category_month_key" ON "MonthlyTrend"("category", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyTrend_category_week_key" ON "WeeklyTrend"("category", "week");
