import pool from '../config/db.js';

// Get all notifications from the database
export const getAllNotifications = async () => {
    try {
        const client = await pool.connect();
        // const result = await client.query(DBgetAllUsers());
        const result = await client.query(`
      SELECT *
      FROM notifications
    `);
        const notifications = result.rows;
        client.release();
        return notifications;
    } catch (err) {
        throw err;
    }
};