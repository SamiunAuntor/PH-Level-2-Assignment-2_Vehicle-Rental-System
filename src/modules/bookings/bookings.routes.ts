import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Create booking (Customer or Admin)
router.post("/", authMiddleware.auth(), bookingsController.createBooking);


export const bookingsRoutes = router;