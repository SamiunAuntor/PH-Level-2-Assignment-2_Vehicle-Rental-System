import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users`
    );
    return result.rows;
};

const updateUser = async (id: number, payload: any) => {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in payload) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key]);
        index++;
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    values.push(id);

    const result = await pool.query(
        `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING id, name, email, phone, role
        `,
        values
    );

    if (result.rowCount === 0) {
        throw new Error("User not found");
    }

    return result.rows[0];
};

const deleteUser = async (id: number) => {

    const activeBookingCheck = await pool.query(
        `
        SELECT 1 FROM bookings
        WHERE customer_id = $1
        AND status = 'active'
        LIMIT 1
        `,
        [id]
    );

    if (activeBookingCheck.rowCount && activeBookingCheck.rowCount > 0) {
        throw new Error("User has active bookings");
    }

    const result = await pool.query(
        `DELETE FROM users WHERE id = $1`,
        [id]
    );

    if (result.rowCount === 0) {
        throw new Error("User not found");
    }

    return true;
};

export const usersServices = {
    getAllUsers,
    updateUser,
    deleteUser,
};