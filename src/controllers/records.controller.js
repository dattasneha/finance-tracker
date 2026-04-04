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

const viewRecords = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const records = await prisma.transaction.findMany({
        where: { userId }
    });
    return res.status(200).json(new ApiResponse(records, "Records retrieved successfully."));
});

const viewRecordById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 
    const record = await prisma.transaction.findFirst({
        where: { id, userId }
    }); 
    if (!record) {
        return res.status(404).json(new ApiResponse(null, "Record not found."));
    }   
    return res.status(200).json(new ApiResponse(record, "Record retrieved successfully."));
});

const updateRecords = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, description } = transactionSchema.parse(req.body);
    const userId = req.user.id; 
    const updatedRecord = await prisma.transaction.updateMany({
        where: { id, userId },
        data: {
            amount,
            type,
            category,   
            date: new Date(date),
            description
        }
    });
    return res.status(200).json(new ApiResponse(updatedRecord, "Record updated successfully."));
}); 

const deleteRecords = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 
    await prisma.transaction.delete({
        where: { id, userId }
    });
    return res.status(200).json(new ApiResponse(null, "Record deleted successfully."));
});

export {createRecords, viewRecords, updateRecords, deleteRecords};