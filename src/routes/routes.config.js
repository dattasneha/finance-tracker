import express from "express";
import authRouter from "./auth.routes.js";
import recordsRouter from "./records.routes.js";
const Routes = new express.Router();

Routes.use("/auth", authRouter);
Routes.use("/records", recordsRouter);
export default Routes;