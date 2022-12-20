import pool from '../config/db.js';
import log from '../config/log.js';

const createNotification = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    
    const notif = await client.query(`
    INSERT INTO notifications(sender_id, receiver_id, type, read)
    VALUES($1, $2, $3, $4)
    RETURNING id
    `, [sender_id, receiver_id, type, false]);

    client.release();
    return notif.rows[0].id;
}

const handleVisitAndMessage = async (sender_id, receiver_id, type) => {
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
        id = await createNotification(sender_id, receiver_id, type);
    } else {
        id = notif.rows[0].id
        if (notif.read === true) {
            await updateReadNotification(id)
        }
        await updateTimeNotification(id)
    }

    client.release();
    return id;
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

// Insert a new notification into the database
export const insertNotification = async (sender_id, receiver_id, type) => {
    try {
        var id = 0;
        if (type === "visit" || type === "message") {
            return handleVisitAndMessage(sender_id, receiver_id, type)
        }
        
        if (type == "like") {
            
            const liked = await getNotification(receiver_id, sender_id, type);
            if (liked === null) {
                return await createNotification(sender_id, receiver_id, type);
            }

            await deleteNotification(liked.id);
            await createNotification(sender_id, receiver_id, "match");
            return await createNotification(receiver_id, sender_id, "match");
        }

        const likeNotif = await getNotification(sender_id, receiver_id, "like");
        console.log(likeNotif);
        if (likeNotif) {
            await deleteNotification(likeNotif.id);
        }

        const match = await getNotification(receiver_id, sender_id, "match");
        if (match) {
            const reverse = await getNotification(sender_id, receiver_id, "match");
            await deleteNotification(match.id);
            await deleteNotification(reverse.id);
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
        await client.query(`DELETE FROM notifications WHERE id = $1`, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};
