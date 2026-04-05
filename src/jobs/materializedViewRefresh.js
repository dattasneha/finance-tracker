import cron from "node-cron";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const startMaterializedViewRefreshJob = () => {
  cron.schedule('5 * * * *', async () => {
    try {
      console.log("Refreshing materialized views...");

      await pool.query(
        `REFRESH MATERIALIZED VIEW CONCURRENTLY user_financial_summary;`
      );

      await pool.query(
        `REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_trends;`
      );

      await pool.query(
        `REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_trends;`
      );

      console.log("Materialized views refreshed successfully");
    } catch (error) {
      console.error("Error refreshing materialized views:", error);
    }
  });
};