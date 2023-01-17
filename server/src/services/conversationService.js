import pool from '../config/db.js';
import log from '../config/log.js';
import { NotFoundError } from '../errors/error.js';

const getConversationWithRecipientDetails = async (id, userId1, userId2) => {
    const client = await pool.connect();
    try {

        const conversation = await client.query(`
            SELECT conversation.id, conversation.userId1, conversation.userId2,
            user1.first_name || ' ' || user1.last_name as user1_name,
            user2.first_name || ' ' || user2.last_name as user2_name,
            user1.status as user1_status,
            user2.status as user2_status,
            (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message,
            (SELECT unread FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_unread,
            (SELECT file_path FROM user_files WHERE user_id = user1.id AND is_profile_pic = true) as user1_file_path,
            (SELECT file_path FROM user_files WHERE user_id = user2.id AND is_profile_pic = true) as user2_file_path
            FROM conversation
            JOIN users as user1 ON user1.id = conversation.userId1
            JOIN users as user2 ON user2.id = conversation.userId2
            WHERE conversation.id = $1 AND ((conversation.userId1 = $2 AND conversation.userId2 = $3) OR (conversation.userId1 = $3 AND conversation.userId2 = $2));
        `, [id, userId1, userId2]);

        return conversation.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};


export const getConversationBetween = async (userId1, userId2) => {
    const client = await pool.connect();
    try {

        const conversation = await client.query(' \
            SELECT * FROM conversation \
            WHERE (userId1 = $1 AND userId2 = $2) OR (userId1 = $2 AND userId2 = $1)',
        [userId1, userId2]);

        if (conversation.rowCount === 0)
           throw new NotFoundError("Conversation does not exist")
        else
            return getConversationWithRecipientDetails(conversation.rows[0].id, userId1, userId2);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

export const createConversation = async (userId1, userId2) => {
    const client = await pool.connect();
    try {

        const conversation = await client.query(' \
            SELECT * FROM conversation \
            WHERE (userId1 = $1 AND userId2 = $2) OR (userId1 = $2 AND userId2 = $1)',
        [userId1, userId2]);

        if (conversation.rowCount === 0) {
            const result = await client.query(`
                INSERT INTO conversation (userId1, userId2, message_history)
                VALUES ($1, $2, '{}') RETURNING *;`,
            [userId1, userId2]);

            return getConversationWithRecipientDetails(result.rows[0].id, userId1, userId2);
        }
        else {
            return getConversationWithRecipientDetails(conversation.rows[0].id, userId1, userId2);
        }
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

export const getConversationsOf = async (id) => {
    const client = await pool.connect();
    try {

        const conversations = await client.query(`
            SELECT conversation.id, conversation.userId1, conversation.userId2,
            user1.first_name || ' ' || user1.last_name as user1_name,
            user2.first_name || ' ' || user2.last_name as user2_name,
            user1.status as user1_status,
            user2.status as user2_status,
            (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message,
            (SELECT sender_id FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_author_id,
            (SELECT unread FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_unread,
            (SELECT file_path FROM user_files WHERE user_id = user1.id AND is_profile_pic = true) as user1_file_path,
            (SELECT file_path FROM user_files WHERE user_id = user2.id AND is_profile_pic = true) as user2_file_path
            FROM conversation
            JOIN users as user1 ON user1.id = conversation.userId1
            JOIN users as user2 ON user2.id = conversation.userId2
            WHERE (conversation.userId1 = $1 OR conversation.userId2 = $1);`,
        [id]);

        return conversations.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};


//Deletes all the messages linked to the conversaion id and then the conversation.
export const deleteConversation = async (id) => {
    const client = await pool.connect();
    try {

        await client.query(`
            DELETE FROM messages
            WHERE conversation_id = $1;
        `, [id]);

        await client.query(`
            DELETE FROM conversation
            WHERE id = $1;
        `, [id]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

//Deletes messages and conversation between 2 users.
export const deleteConversationOfPair = async (id1, id2) => {
    const client = await pool.connect();
    try {

        const conversation = await client.query(' \
            SELECT id FROM conversation \
            WHERE (userId1 = $1 AND userId2 = $2) \
            OR (userId1 = $2 AND userId2 = $1);',
        [id1, id2]);

        if (conversation.rowCount === 0)
            return ;
        await deleteConversation(conversation.rows[0].id);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};
