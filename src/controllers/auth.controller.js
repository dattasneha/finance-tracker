import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {prisma} from "../utils/prismaClient.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../models/register.schema.js";
import { loginSchema } from "../models/login.schema.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import {
  generateAccessToken,
} from "../utils/tokenGenerator.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(
      401,
      "Email address is not registered."
    );
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Password is incorrect. Try again!"
    );
  }

  const accessToken = generateAccessToken(user);

  const { password: _unused, ...sanitizedUser } = user;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        { ...sanitizedUser, accessToken },
        "User logged in successfully."
      )
    );
});

const register = asyncHandler(async (req, res) => {

  const { name, email, password, role } = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "VIEWER"
    }
  });

  const { password: _unused, ...sanitizedUser } = user;

  return res
    .status(201)
    .json(
      new ApiResponse(
        sanitizedUser,
        "User registered successfully."
      )
    );
});

export { login, register };  