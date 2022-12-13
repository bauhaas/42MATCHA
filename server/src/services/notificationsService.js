import pool from '../config/db.js';

//TODO
// import { DBgetAllNotifications, DBdeleteNotification } from '../utils/queryNotificationsUtils.js';

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
        console.log('AAAA', result);
        client.release();
        return notifications;
    } catch (err) {
        throw err;
    }
};

// Delete a user from the database
export const deleteNotification = async (id) => {
    try {
        const client = await pool.connect();
        //TODO replace query by that:
        // await client.query(DBdeleteNotification(id));

        await client.query(`
        DELETE FROM notifications
        WHERE id = $1
        `, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};