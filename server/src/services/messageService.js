import pool from '../config/db.js';
import log from '../config/log.js';
import { NotFoundError } from '../errors/error.js';

const GET_MESSAGE_HISTORY =
    'SELECT * \
    FROM messages \
    WHERE conversation_id = $1 \
    ORDER BY created_at ASC;';

// Create a message and link it to a conversation.
export const createMessage = async (payload) => {
    const client = await pool.connect();
    try {
        log.info('[messageService]', 'createMessage:', payload);

        const conversation = await client.query('\
            SELECT id \
            FROM conversation \
            WHERE (userId1 = $1 AND userId2 = $2) OR (userId1 = $2 AND userId2 = $1);',
        [payload.from, payload.to]);

        if (conversation.rowCount === 0)
            throw new NotFoundError('conversation between these users does not exist');

        await client.query('\
            INSERT INTO messages (sender_id, message, conversation_id) \
            VALUES ($1, $2, $3)',
        [payload.from,  payload.content, conversation.rows[0].id]);

        const messageHistory = await client.query(GET_MESSAGE_HISTORY, [conversation.rows[0].id]);
        return messageHistory.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Update all the messages of a conversation as read which affects
// the way conversation card will render on the client
export const setMessagesAsRead = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[messageService]', 'setMessagesAsRead');

        await client.query('\
            UPDATE messages \
            SET unread = false \
            WHERE conversation_id = $1;',
        [id]);

    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Get all the messages from a conversation, by its id
export const getMessageHistory = async (id) => {
    const client = await pool.connect();
    try {
        log.info('[messageService]', 'getMessageHistory');

        const messageHistory = await client.query(GET_MESSAGE_HISTORY, [id]);
        return messageHistory.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};