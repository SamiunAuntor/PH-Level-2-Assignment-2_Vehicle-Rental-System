import { Pool } from "pg";
import config from '.';

// db pool
export const pool = new Pool({
    connectionString: `${config.db_connection_str}`,
});

const initDB = async () => {

    // create users table
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL CHECK(email = LOWER(email)),
        password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('customer', 'admin'))
    );`
    );

    // create vehicles table
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price INTEGER NOT NULL CHECK(daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK(availability_status IN ('available', 'booked'))
    );`
    )

    // creata bookings table
    await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
        total_price INTEGER NOT NULL CHECK(total_price > 0),
        status VARCHAR(20) NOT NULL CHECK(status IN ('active', 'cancelled', 'returned'))
    );`
    )
}



export default initDB;