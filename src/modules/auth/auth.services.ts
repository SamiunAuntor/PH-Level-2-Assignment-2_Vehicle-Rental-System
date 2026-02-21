import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';

const signupUser = async (name: string, email: string, password: string, phone: string, role: string) => {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await pool.query(`INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role`,
        [name, email, hashedPassword, phone, role]
    );

    // Return the newly created user
    return result.rows[0];
}

export const authServices = {
    signupUser,
};