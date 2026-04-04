import express from "express";
import authRouter from "./auth.routes.js";

const Routes = new express.Router();

Routes.use("/auth", authRouter);

export default Routes;