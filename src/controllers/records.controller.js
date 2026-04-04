import { transactionSchema } from "../models/transaction.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { prisma } from "../utils/prismaClient.js";

const createRecords = asyncHandler(async (req, res) => {
  const { amount, type, category, date, description } = transactionSchema.parse(req.body);
  const userId = req.user.id;
  
  const newRecord = await prisma.transaction.create({
    data: {
        amount,
        type,
        category,   
        date: new Date(date),
        description,
        userId
    }
  })

  return res.status(201).json(
    new ApiResponse(newRecord, "Transaction record created successfully.")
  )
});

export {createRecords};