import { transactionSchema,updateTransactionSchema} from "../models/transaction.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { prisma } from "../utils/prismaClient.js";
import { is } from "zod/locales";

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

const viewRecords = asyncHandler(async (req, res) => {
    const records = await prisma.transaction.findMany();

    return res
        .status(200)
        .json(new ApiResponse(records, "All records retrieved successfully."));
});

const viewRecordById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const record = await prisma.transaction.findUnique({
        where: { id }
    });

    if (!record) {
        return res.status(404).json(new ApiResponse(null, "Record not found."));
    }

    return res.status(200).json(new ApiResponse(record, "Record retrieved successfully."));
});

const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const parsedData = updateTransactionSchema.parse(req.body);
  const existingRecord = await prisma.transaction.findFirst({
    where: { id, userId }
  });

  if (!existingRecord) {
    throw new ApiError(404, "Record not found.");
  }

  const updateData = { ...parsedData };

  if (parsedData.date) {
    updateData.date = new Date(parsedData.date);
  }

  const updatedRecord = await prisma.transaction.update({
    where: { id },
    data: updateData
  });

  return res.status(200).json(
    new ApiResponse(updatedRecord, "Record updated successfully.")
  );
});
 

const deleteRecords = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 
    const existingRecord = await prisma.transaction.findFirst({
        where: { id, userId },
        data:{
            isDeleted: true
        }

    });
    return res.status(200).json(new ApiResponse(null, "Record deleted successfully."));
});

export {createRecords, viewRecords, viewRecordById, updateRecord, deleteRecords};