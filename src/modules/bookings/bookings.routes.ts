import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Create booking (Customer or Admin)
router.post("/",
    authMiddleware.auth(),
    bookingsController.createBooking
);

// Get all bookings
router.get(
    "/",
    authMiddleware.auth(),
    bookingsController.getAllBookings
);

// update booking (admin or own)
router.put(
    "/:bookingId",
    authMiddleware.auth(),
    bookingsController.updateBookingStatus
);


export const bookingsRoutes = router;