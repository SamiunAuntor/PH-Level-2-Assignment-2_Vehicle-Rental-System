import { Request, Response } from "express";
import { authServices } from "./auth.services";


const signupUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    // Validate input
    if (!name || !email || !password || !phone || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const result = await authServices.signupUser(name, email, password, phone, role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }


}

export const authController = {
    signupUser,
};