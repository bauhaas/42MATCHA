import pool from '../config/db.js';
import log from '../config/log.js';

import { updateUserFameRating } from './userService.js'
import { deleteConversationOfPair} from './conversationService.js';
import { createNotification, deleteAllNotificationsOfPair } from './notificationsService.js';


const createRelation = async (sender_id, receiver_id, type) => {
    try {
        const client = await pool.connect();

        const notif = await client.query(`
        INSERT INTO relations(sender_id, receiver_id, type)
        VALUES($1, $2, $3)
        RETURNING *
        `, [sender_id, receiver_id, type]);
        client.release();
        return notif.rows[0];
    } catch (err) {
        throw err;
    }
}

// Get all relations from the database
export const getAllRelations = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM relations`);
        client.release();
        return result.rows;
    } catch (err) {
        throw err;
    }
};


export const getRelation = async (sender_id, receiver_id, type) => {
    try {
        const client = await pool.connect();
        const notif = await client.query(`
        SELECT * FROM relations
        WHERE sender_id = $1
        AND receiver_id = $2
        AND type = $3
        `, [sender_id, receiver_id, type]);

        client.release();
        if (notif.rowCount > 0) {
            return notif.rows[0]
        }
        return null;
    } catch (err) {
        throw err;
    }
}


export const getRelationTypeOfUsers = async (sender_id, receiver_id) => {
    try {
        log.info('[relationService]', "getLikedUsersBySenderId");
        const client = await pool.connect();

        console.log(sender_id, receiver_id)
        const result = await client.query(`
        SELECT type
        FROM relations
        WHERE sender_id = $1
        AND receiver_id = $2
        `, [sender_id, receiver_id]);
        if (result.rows[0] === undefined) {
            return "none";
        }
        const type = result.rows[0].type;
        if (type === null) {
            return "none";
        }
        client.release();
        return type;
    } catch (err) {
        throw err;
    }
}

export const getRelationsBySenderId = async (id) => {
    try {
        const client = await pool.connect();
        const notif = await client.query(`
        SELECT * FROM relations
        WHERE sender_id = $1
        `, [id]);

        client.release();
        if (notif.rowCount > 0) {
            return notif.rows
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export const isBlocked = async (sender_id, receiver_id) => {
    const blocked = await getRelation(receiver_id, sender_id, "block");
    if (blocked === null) {
        return false;
    }
    return true;
}

const deleteRelationsOfUsers = async (sender_id, receiver_id) => {
    const like = await getRelation(sender_id, receiver_id, "like");
    if (like) {
        await deleteRelation(like.id);
    }
    const reverseLike = await getRelation(receiver_id, sender_id, "like");
    if (reverseLike) {
        await deleteRelation(reverseLike.id);
    }

    const match = await getRelation(sender_id, receiver_id, "match");
    if (match) {
        const reverseMatch = await getRelation(receiver_id, sender_id, "match");
        await deleteRelation(match.id);
        await deleteRelation(reverseMatch.id);
    }
}


const createBlockRelation = async (sender_id, receiver_id) => {
    await deleteRelationsOfUsers(sender_id, receiver_id);
    await deleteAllNotificationsOfPair(sender_id, receiver_id);
    await deleteConversationOfPair(sender_id, receiver_id);

    return await createRelation(sender_id, receiver_id, "block");
}

const createLikeRelation = async (sender_id, receiver_id) => {
    const alreadyLiked = await getRelation(sender_id, receiver_id, "like");
    if (alreadyLiked) {
        return alreadyLiked;
    }

    const liked = await getRelation(receiver_id, sender_id, "like");
    if (liked === null) {
        await createNotification(sender_id, receiver_id, "like");
        return await createRelation(sender_id, receiver_id, "like");
    }

    await updateUserFameRating(sender_id, true);
    await updateUserFameRating(receiver_id, true);

    await deleteRelation(liked.id);

    await createNotification(sender_id, receiver_id, "match");
    await createNotification(receiver_id, sender_id, "match");

    await createRelation(sender_id, receiver_id, "match");
    return await createRelation(receiver_id, sender_id, "match");
}

// Insert a new notification into the database
export const insertRelation = async (sender_id, receiver_id, type) => {
    try {
        const validTypes = ["block", "like", "unlike"];

        if (validTypes.includes(type) === false) {
            throw 'insertRelation: wrong type ' + type;
        }
        var id = 0;

        if (type === "block") {
            return await createBlockRelation(sender_id, receiver_id);
        }

        if (type == "like") {
            return await createLikeRelation(sender_id, receiver_id);
        }

        const likeNotif = await getRelation(sender_id, receiver_id, "like");
        if (likeNotif) {
            return await deleteRelation(likeNotif.id);
        }

        const match = await getRelation(sender_id, receiver_id, "match");
        if (match === null) {
            return id;
        }

        await updateUserFameRating(sender_id, false);
        await updateUserFameRating(receiver_id, false);

        const reverse = await getRelation(receiver_id, sender_id, "match");
        await deleteRelation(match.id);
        await deleteRelation(reverse.id);

        return await createNotification(sender_id, receiver_id, type);
    } catch (err) {
        log.error('[relationsService]', err);
        throw err;
    }
};


// Delete a user from the database
export const deleteRelationByContent = async (sender_id, receiver_id, type) => {
    try {
        log.info('[relationsService]', 'gonna delete relation');
        const client = await pool.connect();
        const result = await client.query(`
        DELETE FROM relations
        WHERE sender_id = $1
        AND receiver_id = $2
        AND type = $3
        `, [sender_id, receiver_id, type]);
        log.info(result.rows)
        client.release();
    } catch (err) {
        log.error('[relationsService]', err);
        throw err;
    }
};


// Delete a user from the database
export const deleteRelation = async (id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM relations WHERE id = $1`, [id]);
        log.info(result.rows)
        client.release();
    } catch (err) {
        log.error('[relationsService]', err);
        throw err;
    }
};
