-- This is an empty migration.

CREATE MATERIALIZED VIEW user_financial_summary AS
SELECT 
    "userId",

    SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_income,

    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_expense,

    SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS net_balance

FROM "Transaction"
WHERE "isDeleted" = false
GROUP BY "userId";

CREATE UNIQUE INDEX idx_user_financial_summary_userid
ON user_financial_summary ("userId");

CREATE MATERIALIZED VIEW monthly_trends AS
SELECT
    "userId",
    DATE_TRUNC('month', "date") AS month,

    SUM(CASE WHEN type='INCOME' THEN amount ELSE 0 END) AS income,
    SUM(CASE WHEN type='EXPENSE' THEN amount ELSE 0 END) AS expense

FROM "Transaction"
WHERE "isDeleted" = false
GROUP BY "userId", month;

CREATE INDEX idx_monthly_trends
ON monthly_trends ("userId");

CREATE MATERIALIZED VIEW weekly_trends AS
SELECT
    "userId",
    DATE_TRUNC('week', "date") AS week,

    SUM(CASE WHEN type='INCOME' THEN amount ELSE 0 END) AS income,
    SUM(CASE WHEN type='EXPENSE' THEN amount ELSE 0 END) AS expense

FROM "Transaction"
WHERE "isDeleted" = false
GROUP BY "userId", week;

CREATE INDEX idx_weekly_trends
ON weekly_trends ("userId");