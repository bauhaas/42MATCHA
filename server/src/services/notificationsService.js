import pool from '../config/db.js';
import log from '../config/log.js';

import { updateUserFameRating } from './userService.js'

const createNotification = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    
    const notif = await client.query(`
    INSERT INTO notifications(sender_id, receiver_id, type, read)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `, [sender_id, receiver_id, type, false]);
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

export const getSenderNotifications = async (id) => {
    const client = await pool.connect();
    const notif = await client.query(`
    SELECT * FROM notifications
    WHERE sender_id = $1
    `, [id]);

    client.release();
    if (notif.rowCount > 0) {
        return notif.rows
    }
    return null;
}


const handleVisitAndMessageNotif = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    const notif = await client.query(`
        SELECT * FROM notifications
        WHERE sender_id = $1
        AND receiver_id = $2
        AND type = $3
    `, [sender_id, receiver_id, type]);
    console.log(notif);
    var id = 0;
    if (notif.rowCount == 0) {
        return await createNotification(sender_id, receiver_id, type);
    }

    id = notif.rows[0].id
    if (notif.read === true) {
        await updateReadNotification(id)
    }
    await updateTimeNotification(id)

    client.release();
    return id;
}

const handlelikeNotif = async (sender_id, receiver_id) => {
    const alreadyLiked = await getNotification(sender_id, receiver_id, "like");
    if (alreadyLiked) {
        return alreadyLiked;
    }

    const alreadyMatched = await getNotification(sender_id, receiver_id, "match");
    if (alreadyMatched) {
        return alreadyMatched;
    }
    
    const unliked = await getNotification(sender_id, receiver_id, "unlike");
    if (unliked) {
        await deleteNotification(unliked.id);
    }

    const liked = await getNotification(receiver_id, sender_id, "like");
    if (liked === null) {
        return await createNotification(sender_id, receiver_id, "like");
    }
    
    await updateUserFameRating(sender_id, true);
    await updateUserFameRating(receiver_id, true);
    await deleteNotification(liked.id);
    await createNotification(sender_id, receiver_id, "match");
    return await createNotification(receiver_id, sender_id, "match");
}

// Insert a new notification into the database
export const insertNotification = async (sender_id, receiver_id, type) => {
    try {
        const validTypes = ["visit", "message", "like", "unlike"];

        if (validTypes.includes(type) === false) {
            throw 'insertNotification: wrong type';
        }
        var id = 0;
        if (type === "visit" || type === "message") {
            return handleVisitAndMessageNotif(sender_id, receiver_id, type)
        }
        
        if (type == "like") {
            return await handlelikeNotif(sender_id, receiver_id);
        }

        const likeNotif = await getNotification(sender_id, receiver_id, "like");
        if (likeNotif) {
            return await deleteNotification(likeNotif.id);
        }

        const match = await getNotification(receiver_id, sender_id, "match");
        if (match) {
            await updateUserFameRating(sender_id, false);
            await updateUserFameRating(receiver_id, false);
            const reverse = await getNotification(sender_id, receiver_id, "match");
            await deleteNotification(match.id);
            await deleteNotification(reverse.id);
            return await createNotification(sender_id, receiver_id, type);
        }

        return id;
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
