import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";

// Create booking
const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await bookingsServices.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



export const bookingsController = {
    createBooking,
};