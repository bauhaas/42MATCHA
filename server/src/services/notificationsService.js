import pool from '../config/db.js';
import log from '../config/log.js';

//TODO
// import { DBgetAllNotifications, DBdeleteNotification } from '../utils/queryNotificationsUtils.js';

// Get all notifications from the database
export const getAllNotifications = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM notifications`);
        client.release();
        return result.rows;
    } catch (err) {
        throw err;
    }
};

// Delete a user from the database
export const deleteNotification = async (id) => {
    try {
        const client = await pool.connect();
        await client.query(`DELETE FROM notifications WHERE id = $1`, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};

// Update a notifications's information in the database
export const updateNotification = async (id) => {
    try {
        log.info('', 'id:', id);
        const client = await pool.connect();
        await client.query(`UPDATE notifications SET read = $1 WHERE id = $2`, [true, id]);
        client.release();
    } catch (err) {
        throw err;
    }
};


function getKey(value) {
    const socketmap = global.socketUser;
    return [...socketmap].find(([key, val]) => val == value)[0]
}

// Insert a new notification into the database
export const insertNotification = async (sender_id, user_id, type) => {
    try {
        const client = await pool.connect();
        const id = await client.query(`
        INSERT INTO notifications(sender_id, user_id, type, read)
        VALUES($1, $2, $3, $4)
        RETURNING id
        `, [sender_id, user_id, type, false]);

        //Alert the user concerned by the notif
        log.info('[notifService]', 'Current maps of socket connected:', global.socketUser);
        const socketid = getKey(user_id);
        const result = await client.query(`
            SELECT *
            FROM notifications
            WHERE user_id = $1
            `, [user_id]);
        const notifications = result.rows;
        log.info('[notifService]', 'retrieved notifications:', notifications);
        log.info('[notifService]', socketid, 'must get \'receiveNotifs\' event');
        const io = global.io;
        io.to(socketid).emit('receiveNotifs', notifications);


        client.release();
        return id;
    } catch (err) {
        console.log(err);
        throw err;
    }
};