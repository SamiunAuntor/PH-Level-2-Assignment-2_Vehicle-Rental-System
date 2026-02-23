import { pool } from "../../config/db";

// auto-return helper function using node-cron
export const autoReturnExpiredBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Get all active bookings that have passed their end date
    const expiredBookings = await pool.query(
        `SELECT * FROM bookings WHERE status = 'active' AND rent_end_date < $1`,
        [today]
    );

    for (const booking of expiredBookings.rows) {
        // Update booking status
        await pool.query(
            `UPDATE bookings SET status = 'returned' WHERE id = $1`,
            [booking.id]
        );

        // Update vehicle availability
        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        console.log(`Booking ID ${booking.id} auto-returned`);
    }

    return expiredBookings.rows.length;
};

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

// get all bookings (admin = all, customer = his all booking)
const getAllBookings = async (loggedInUser: any) => {
    // run auto-return function
    await autoReturnExpiredBookings();

    // if requester is admin
    if (loggedInUser.role === "admin") {

        const result = await pool.query(`
            SELECT 
                b.id,
                b.customer_id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                u.name AS customer_name,
                u.email AS customer_email,
                v.vehicle_name,
                v.registration_number
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.id DESC
        `);

        return {
            message: "Bookings retrieved successfully",
            data: result.rows.map(row => ({
                id: row.id,
                customer_id: row.customer_id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date.toISOString().split('T')[0],
                rent_end_date: row.rent_end_date.toISOString().split('T')[0],
                total_price: row.total_price,
                status: row.status,
                customer: {
                    name: row.customer_name,
                    email: row.customer_email,
                },
                vehicle: {
                    vehicle_name: row.vehicle_name,
                    registration_number: row.registration_number,
                }
            }))
        };
    }

    // if requester is customer
    const result = await pool.query(`
        SELECT 
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC
    `, [loggedInUser.id]);

    return {
        message: "Your bookings retrieved successfully",
        data: result.rows.map(row => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date.toISOString().split('T')[0],
            rent_end_date: row.rent_end_date.toISOString().split('T')[0],
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type,
            }
        }))
    };
};

// update booking status
const updateBookingStatus = async (
    bookingId: number,
    status: string,
    loggedInUser: any
) => {

    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingResult.rowCount === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    // role based access
    if (loggedInUser.role !== "admin") {

        if (booking.customer_id !== loggedInUser.id) {
            throw new Error("Forbidden");
        }

        if (status !== "cancelled") {
            throw new Error("Customers can only cancel bookings");
        }
    }

    // if eligible to update then perform update
    const updatedResult = await pool.query(
        `UPDATE bookings
         SET status = $1
         WHERE id = $2
         RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
        [status, bookingId]
    );

    const updatedBooking = updatedResult.rows[0];

    // normalize date format for response
    updatedBooking.rent_start_date = updatedBooking.rent_start_date.toISOString().split('T')[0];
    updatedBooking.rent_end_date = updatedBooking.rent_end_date.toISOString().split('T')[0];

    // update logic
    if (status === "cancelled" || status === "returned") {
        await pool.query(
            `UPDATE vehicles
             SET availability_status = 'available'
             WHERE id = $1`,
            [booking.vehicle_id]
        );
    }

    return updatedBooking;
};

export const bookingsServices = {
    createBooking,
    updateBookingStatus,
    getAllBookings,
};