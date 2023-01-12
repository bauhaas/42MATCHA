import pool from '../config/db.js';
import log from '../config/log.js';

import { updateUserFameRating } from './userService.js'
import { createConversation, deleteConversationOfPair} from './conversationService.js';
import { createNotification } from './notificationsService.js';
import { BadRequestError, ForbiddenError } from '../errors/error.js';


const createRelation = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    try {
        const relation = await client.query(`
            INSERT INTO relations(sender_id, receiver_id, type)
            VALUES($1, $2, $3)
            RETURNING *`,
        [sender_id, receiver_id, type]);

        return relation.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const getAllRelations = async () => {
    const client = await pool.connect();
    try {
        const relations = await client.query(`SELECT * FROM relations`);
        return relations.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

export const getRelation = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    try {
        const relation = await client.query(`
            SELECT * FROM relations
            WHERE sender_id = $1
            AND receiver_id = $2
            AND type = $3`,
        [sender_id, receiver_id, type]);

        if (relation.rowCount > 0) {
            return relation.rows[0]
        }
        return null;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const isBlocked = async (sender_id, receiver_id) => {
    const blocked = await getRelation(receiver_id, sender_id, "block");
    return blocked ? true : false;
}

const deleteRelationsOfUsers = async (sender_id, receiver_id) => {
    const like = await getRelation(sender_id, receiver_id, "like");
    if (like)
        await deleteRelation(like.id);

    const reverseLike = await getRelation(receiver_id, sender_id, "like");
    if (reverseLike)
        await deleteRelation(reverseLike.id);

    const match = await getRelation(sender_id, receiver_id, "match");
    if (match) {
        const reverseMatch = await getRelation(receiver_id, sender_id, "match");
        await deleteRelation(match.id);
        await deleteRelation(reverseMatch.id);
    }
}

const createBlockRelation = async (sender_id, receiver_id) => {
    const block = await getRelation(sender_id, receiver_id, "block");
    if (block)
        return block;

    await deleteRelationsOfUsers(sender_id, receiver_id);
    await deleteConversationOfPair(sender_id, receiver_id);

    return await createRelation(sender_id, receiver_id, "block");
}

const createLikeRelation = async (sender_id, receiver_id) => {
    const alreadyLiked = await getRelation(sender_id, receiver_id, "like");
    if (alreadyLiked)
        return alreadyLiked;

    //If there is no match yet
    const liked = await getRelation(receiver_id, sender_id, "like");
    if (liked === null) {
        await createNotification(sender_id, receiver_id, "like");
        return await createRelation(sender_id, receiver_id, "like");
    }

    //Case where is a match
    await updateUserFameRating(sender_id, true);
    await updateUserFameRating(receiver_id, true);

    await deleteRelation(liked.id);

    await createRelation(sender_id, receiver_id, "match");
    const match = await createRelation(receiver_id, sender_id, "match");
    await createConversation(sender_id, receiver_id); //create conv here instead of onclik profile
    await createNotification(sender_id, receiver_id, "match");
    await createNotification(receiver_id, sender_id, "match");
    return match;
}

//TODO flemme un peu mais normalement on devrait pas insert d'unlike relation mais
// passer par la route delete pour ça.
export const insertRelation = async (sender_id, receiver_id, type) => {
    try {

        const blocked = await isBlocked(sender_id, receiver_id);
        if (blocked)
          throw new ForbiddenError('You have been blocked by this user');

        const validTypes = ["block", "like", "unlike"];

        if (validTypes.includes(type) === false)
            throw new BadRequestError('Relation type is invalid')

        if (type === "block")
            return await createBlockRelation(sender_id, receiver_id);
        else if (type == "like")
            return await createLikeRelation(sender_id, receiver_id);
        else if (type == "unlike") {
            const likeRelation = await getRelation(sender_id, receiver_id, "like");
            if (likeRelation) {
                return await deleteRelation(likeRelation.id);
            }

            const match = await getRelation(sender_id, receiver_id, "match");
            if (match === null)
                return null;

            const reverse = await getRelation(receiver_id, sender_id, "match");
            if (reverse === null)
                return null;

            await deleteRelation(match.id);
            await deleteRelation(reverse.id);

            await updateUserFameRating(sender_id, false);
            await updateUserFameRating(receiver_id, false);

            await deleteConversationOfPair(sender_id, receiver_id);
            return await createNotification(sender_id, receiver_id, type);
        }
    } catch (err) {
        throw err;
    }
};

export const deleteRelationByContent = async (sender_id, receiver_id, type) => {
    const client = await pool.connect();
    try {
        log.info('[relationsService]', 'gonna delete relation');

        const result = await client.query(`
            DELETE FROM relations
            WHERE sender_id = $1
            AND receiver_id = $2
            AND type = $3`,
        [sender_id, receiver_id, type]);

    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

export const deleteRelation = async (id) => {
    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM relations WHERE id = $1`, [id]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};
