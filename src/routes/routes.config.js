import express from "express";
import authRouter from "./auth.routes.js";
import recordsRouter from "./records.routes.js";
import dashboardRouter from "./dashboard.routes.js";
const Routes = new express.Router();

Routes.use("/auth", authRouter);
Routes.use("/records", recordsRouter);
Routes.use("/dashboard", dashboardRouter);
export default Routes;