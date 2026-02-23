import { pool } from "../../config/db";

// Create a new booking
const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("Missing required fields");
    }

    // Check vehicle existence
    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    // Check availability
    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available");
    }

    const [startYear, startMonth, startDay] = rent_start_date.split("-").map(Number);
    const [endYear, endMonth, endDay] = rent_end_date.split("-").map(Number);

    const startUTC = Date.UTC(startYear, startMonth - 1, startDay);
    const endUTC = Date.UTC(endYear, endMonth - 1, endDay);

    const timeDiff = endUTC - startUTC;

    if (timeDiff < 0) {
        throw new Error("End date must be after start date");
    }

    const number_of_days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const total_price = number_of_days * vehicle.daily_rent_price;

    // Insert booking
    const bookingResult = await pool.query(
        `INSERT INTO bookings 
            (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, 'active')
         RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    // Update vehicle status
    await pool.query(
        `UPDATE vehicles 
         SET availability_status = 'booked' 
         WHERE id = $1`,
        [vehicle_id]
    );

    const booking = bookingResult.rows[0];

    // Preserve original date format 
    booking.rent_start_date = rent_start_date;
    booking.rent_end_date = rent_end_date;

    // Attach vehicle info 
    booking.vehicle = {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
    };

    return booking;
};

export const bookingsServices = {
    createBooking,
};