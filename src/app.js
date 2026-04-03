import express from "express";
const app = express();

// app.use("/api/v1", v1Routes);

// app.use((_req, res, _next) => {
//   res
//     .status(STATUS.CLIENT_ERROR.NOT_FOUND)
//     .json(new ApiResponse({}, `API endpoint not found: ${_req.originalUrl}`));
// });

export default app;