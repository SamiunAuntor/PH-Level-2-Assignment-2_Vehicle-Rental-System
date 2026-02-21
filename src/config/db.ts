import { Pool } from "pg";
import config from '.';

// db pool
export const pool = new Pool({
    connectionString: `${config.db_connection_str}`,
});

const initDB = async () => {

    // create users table
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN('customer', 'admin'))
    );`
    );

    // create vehicles table
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10, 2) NOT NULL CHECK(daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK(availability_status IN ('available', 'booked'))
    );`
    )

}



export default initDB;