import { Request, Response } from "express";
import { pool } from "../../config/db";
import { usersServices } from "./users.services";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            errors: error.message,
        })
    }
}

export const usersController = {
    getAllUsers,
}