import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getAllUsers();

        res.status(200).json({
            success: true,
            message: result.length
                ? "Users retrieved successfully"
                : "No users found",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            errors: error.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const loggedInUser = (req as any).user;
        const payload = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID not provided",
            });
        }

        const targetUserId = Number(id);

        if (
            loggedInUser.role !== "admin" &&
            loggedInUser.id !== targetUserId
        ) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can only update your own profile",
            });
        }

        const result = await usersServices.updateUser(targetUserId, payload);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });

    } catch (error: any) {

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "No fields to update") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "User update failed",
            errors: error.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID not provided",
            });
        }

        await usersServices.deleteUser(Number(id));

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error: any) {

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "User has active bookings") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "User deletion failed",
            errors: error.message,
        });
    }
};

export const usersController = {
    getAllUsers,
    updateUser,
    deleteUser,
};