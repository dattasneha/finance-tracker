import express from "express";
import cors from "cors";
import Routes from "./routes/routes.config.js";
import ApiResponse from "./utils/apiResponse.js";
import { dashBoardSummaryJob } from "./jobs/dashboardSummary.job.js";

const app = express();
app.use(cors())
app.use(express.json());

dashBoardSummaryJob();
app.use("/api/v1", Routes);

app.use((_req, res, _next) => {
  res
    .status(404)
    .json(new ApiResponse({}, `API endpoint not found: ${_req.originalUrl}`));
});

export default app;