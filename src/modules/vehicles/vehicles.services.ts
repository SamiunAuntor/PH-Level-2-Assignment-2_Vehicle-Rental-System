import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;

    // Validate required fields
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
        throw new Error("Missing required fields");
    }

    // Insert new vehicle into the database
    const result = await pool.query(
        `INSERT INTO vehicles 
     (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status || "available",
        ]
    );

    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query('SELECT * FROM vehicles');
    return result.rows;
};

export const vehiclesServices = {
    createVehicle,
    getAllVehicles,
};