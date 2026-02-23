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

// get all bookings
const getAllBookings = async (req: Request, res: Response) => {
    try {
        const loggedInUser = (req as any).user;

        const result = await bookingsServices.getAllBookings(loggedInUser);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });

    } catch (error: any) {
        res.status(error.message === "Forbidden" ? 403 : 500).json({
            success: false,
            message: error.message || "Error retrieving bookings",
            errors: error.message,
        });
    }
};

// update booking
const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const loggedInUser = (req as any).user;
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        const updatedBooking = await bookingsServices.updateBookingStatus(
            bookingId,
            status,
            loggedInUser
        );

        if (status === "cancelled") {
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: updatedBooking,
            });
        }

        if (status === "returned") {
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: {
                    ...updatedBooking,
                    vehicle: {
                        availability_status: "available",
                    }
                },
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: updatedBooking,
        });

    } catch (error: any) {
        res.status(
            error.message === "Booking not found" ? 404 :
                error.message === "Forbidden" ? 403 : 500
        ).json({
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};

export const bookingsController = {
    createBooking,
    getAllBookings,
    updateBookingStatus,
};