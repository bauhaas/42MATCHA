import pool from '../config/db.js';
import log from '../config/log.js';

import { updateUserFameRating } from './userService.js'

export const createNotification = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();

    const notif = await client.query(`
WITH new_notification AS (
    INSERT INTO notifications(sender_id, receiver_id, type, read)
    VALUES($1, $2, $3, $4)
    RETURNING *
)
SELECT new_notification.*,
    users.first_name || ' ' || users.last_name as fullname,
    user_files.file_path as file_path
FROM new_notification
JOIN users ON users.id = new_notification.sender_id
JOIN user_files ON users.id = user_files.user_id AND user_files.is_profile_pic = true
    `, [sender_id, receiver_id, type, false]);

    const socket = global.map.get(String(receiver_id));
    if (socket) {
        console.log(`has${type}Notif from createNotification`);
        socket.emit(`has${type}Notif`, notif.rows[0]);
    }
    client.release();
    return notif.rows[0];
}


export const getNotification = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    const notif = await client.query(`
    SELECT * FROM notifications
    WHERE sender_id = $1
    AND receiver_id = $2
    AND type = $3
    `, [sender_id, receiver_id, type]);

    client.release();
    if (notif.rowCount > 0) {
        return notif.rows[0]
    }
    return null;
}
export const getNotifById = async (id) => {
    const client = await pool.connect();
    const notif = await client.query(`
    SELECT * FROM notifications
    WHERE sender_id = $1 OR receiver_id = $1
    `, [id]);

    client.release();
    if (notif.rowCount > 0) {
        log.info('[notificationService]', 'return something');
        return notif.rows
    }
    log.info('[notificationService]', 'return null');
    return null;
}

export const getReceivedNotifications = async (id) => {
    const client = await pool.connect();
    const notif = await client.query(`
    SELECT notifications.*, users.first_name || ' ' ||  users.last_name as fullname, user_files.file_path
    FROM notifications
    INNER JOIN users ON notifications.sender_id = users.id
    LEFT JOIN user_files ON users.id = user_files.user_id AND user_files.is_profile_pic = true
    WHERE notifications.receiver_id = $1
  `, [id]);

    client.release();
    if (notif.rowCount > 0) {
        log.info('[notificationService]', 'return something');
        console.log(notif.rows[0]);
        return notif.rows
    }
    log.info('[notificationService]', 'return null');
    return null;
}


// Insert a new notification into the database
export const insertNotification = async (sender_id, receiver_id, type) => {
    try {
        const validTypes = ["visit", "unlike"];

        if (validTypes.includes(type) === false) {
            throw 'insertNotification: wrong type' + type;
        }
        const client = await pool.connect();
        const notif = await client.query(`
            SELECT * FROM notifications
            WHERE sender_id = $1
            AND receiver_id = $2
            AND type = $3
        `, [sender_id, receiver_id, type]);

        if (notif.rowCount == 0) {
            log.info('[notificationService]', 'createNotification and return');
            return await createNotification(sender_id, receiver_id, type);
        }

        const id = notif.rows[0].id
        if (notif.read === true) {
            log.info('[notificationService]', 'updateReadotifcation');
            await updateReadNotification(id)
        }
        log.info('[notificationService]', 'updateTimeNotification');

        await updateTimeNotification(id)
        log.info('[notificationService]', sender_id, receiver_id);

        const socket = global.map.get(String(receiver_id));
        if (socket) {
            console.log(`hasvistNotif from insertNotification`);
            socket.emit('hasVisitNotif', notif.rows[0]);
        }
        return notif.rows[0];
    } catch (err) {
        log.error('[notifService]', err);
        throw err;
    }
};



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


// Update a notifications's updated_at in the database
export const updateTimeNotification = async (id) => {
    try {
        log.info('[notifService]', 'id:', id);
        const client = await pool.connect();

        await client.query(`UPDATE notifications SET updated_at = NOW() WHERE id = $1`, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};

// Update a notifications's read to its inverse in the database
export const updateReadNotification = async (id) => {
    try {
        log.info('[notifService]', 'id:', id);
        const client = await pool.connect();

        await client.query(`UPDATE notifications SET read = NOT read WHERE id = $1`, [id]);
        await updateTimeNotification(id);
        client.release();
    } catch (err) {
        throw err;
    }
};


// Delete a user from the database
export const deleteNotification = async (id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM notifications WHERE id = $1`, [id]);
        log.info(result.rows)
        client.release();
    } catch (err) {
        throw err;
    }
};

export const deleteAllNotificationsOfPair = async (sender_id, receiver_id) => {
    try {
    const client = await pool.connect();

    const result = await client.query(`
    SELECT id FROM notifications
    WHERE (sender_id = $1 AND receiver_id = $2)
    OR (sender_id = $2 AND receiver_id = $1)
    `, [sender_id, receiver_id]);

    console.log(result);
    const notifs = result.rows;
    console.log(notifs);

    for (let i = 0; i < notifs.length; i++) {
        console.log(i, notifs[i].id)
        await deleteNotification(notifs[i].id);
    }
    client.release();
    return sender_id;
    } catch (err) {
        throw err;
    }
}
