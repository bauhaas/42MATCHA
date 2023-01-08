import pool from '../config/db.js';
import log from '../config/log.js';
import { NotFoundError } from '../errors/error.js';

import { updateUserFameRating } from './userService.js'

export const createNotification = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    try {
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
        return notif.rows[0];
    } catch {
        throw err;
    } finally{
        client.release();
    }
}


//TODO seems unused, save just in case
// export const getNotification = async (sender_id, receiver_id, type) => {
//     const client = await pool.connect();
//     const notif = await client.query(`
//         SELECT * FROM notifications
//         WHERE sender_id = $1
//         AND receiver_id = $2
//         AND type = $3
//         `, [sender_id, receiver_id, type]);

//     client.release();
//     if (notif.rowCount > 0) {
//         return notif.rows[0]
//     }
//     return null;
// }

//TODO seems useless. I should only need to get the notif where user is receiver
export const getNotificationsOfUserId = async (id) => {
    log.info('[notificationService.js]', 'getnotifById',id)
    const client = await pool.connect();
    const notif = await client.query(`
        SELECT * FROM notifications
        WHERE sender_id = $1 OR receiver_id = $1
        `, [id]);

    console.log(notif.rows);
    client.release();
    if (notif.rowCount > 0) {
        log.info('[notificationService]', 'return something');
        return notif.rows
    }
    log.info('[notificationService]', 'return null');
    return null;
}

export const getNotificationById = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[notificationService.js]', 'getNotificationById:', id)
        const notification = await client.query(`
            SELECT * FROM notifications
            WHERE id = $1
            `, [id]);

        console.log(notification.rows);
        if (notification.rowCount > 0) {
            log.info('[notificationService]', 'return something');
            return notification.rows
        }
        log.info('[notificationService]', 'return null');
        return null;
    } catch {
        throw err;
    } finally {
        client.release();
    }
}

export const getReceivedNotifications = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[notificationService]', 'getReceivedNotifications of user:', id);

        const notifications = await client.query(`
            SELECT notifications.*, users.first_name || ' ' ||  users.last_name as fullname, user_files.file_path
            FROM notifications
            INNER JOIN users ON notifications.sender_id = users.id
            LEFT JOIN user_files ON users.id = user_files.user_id AND user_files.is_profile_pic = true
            WHERE notifications.receiver_id = $1`,
        [id]);

        return notifications.rows;
    } catch {
        throw err
    } finally {
        client.release();
    }

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
            log.info('[notificationService]', 'updateReadNotifcation');
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

// Get all notifications from db
export const getAllNotifications = async () => {
    const client = await pool.connect();
    try {
        const notifications = await client.query(`SELECT * FROM notifications`);
        if (notifications.rowCount === 0)
            throw new NotFoundError('There isn\'t notifcations yet')
        return notifications.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};


// Update a notifications's updated_at in db
export const updateTimeNotification = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[notifService]', 'id:', id);

        const notif = await getNotificationsOfUserId(id);
        if (notif === null) {
            return ;
        }
        await client.query(`UPDATE notifications SET updated_at = NOW() WHERE id = $1`, [id]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Update a notifications's read to its inverse in the database
export const updateReadNotification = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[notifService]', 'updateReadNotification');

        const notification = await getNotificationById(id);
        if (notification === null)
            throw new NotFoundError(`Notification ${id} not found`);
        await client.query(`UPDATE notifications SET read = NOT read WHERE id = $1`, [id]);
        await updateTimeNotification(id);
    } catch (err) {
        throw err;
    } finally{
        client.release();
    }
};


export const deleteNotification = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[notifService]', 'deleteNotification');

        const notification = await getNotificationById(id);
        if (notification === null)
            throw new NotFoundError(`Notification ${id} not found`);
        await client.query(`DELETE FROM notifications WHERE id = $1`, [id]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
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

    if (result.rowCount === 0) {
        return null;
    }
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
