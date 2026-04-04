import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required.");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role: ${roles.join(", ")}`
      );
    }

    next();
  });