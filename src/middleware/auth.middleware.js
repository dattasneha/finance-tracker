import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { prisma } from "../utils/prismaClient.js";

export const verifyUserJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.UNAUTHORIZED,
      "Authorization token is required."
    );
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(
       401,
      "Invalid or expired token. Authentication failed."
    );
  }
  req.user = user;

  next();
});
