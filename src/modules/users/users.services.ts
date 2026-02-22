import { pool } from "../../config/db"

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result.rows;
}

const deleteUser = async (id: number) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id=$1`,
            [id]);

    if(result.rowCount === 0) {
        throw new Error("User not found");        
    }

    return true;
};

export const usersServices = {
    getAllUsers,
    deleteUser,
}