import pool from '../config/db.js';
import log from '../config/log.js';

// Insert a message into the database and link it to the appropriate conversation
export const insertMessage2 = async (payload) => {
    try {
        const client = await pool.connect();
        log.info('[messageService]', 'insert message with:', payload);

        // Check if a conversation already exists between the two user ids
        const conversationResult = await client.query(`
          SELECT id FROM conversation WHERE (userId1 = $1 AND userId2 = $2) OR (userId1 = $2 AND userId2 = $1);`,
          [payload.from, payload.to]
        );

        if (conversationResult.rowCount === 0) {
            return null;
        }

        // If a conversation does exist, retrieve the id of the existing conversation
        const conversationId = conversationResult.rows[0].id;

        // Insert a new message into the messages table
        await client.query(`
          INSERT INTO messages (sender_id, message, conversation_id) VALUES ($1, $2, $3);`,
          [payload.from,  payload.content, conversationId]
        );

        // Retrieve the message history for the conversation
        const messageHistoryResult = await client.query(`
        SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
        [conversationId]
        );

        if (messageHistoryResult.rowCount === 0) {
            return null;
        }

        const messageHistory = messageHistoryResult.rows;

        client.release();
        return messageHistory;
    } catch (err) {
        throw err;
    }
};

// Patch messages in the database
export const patchMessages = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[messageService]', 'patch', id);
        const result = await client.query(`
        UPDATE messages
        SET unread = false
        WHERE conversation_id = $1;`,
                [id]
        );
        log.info('[messageService]', 'patch done');
        client.release();
    } catch (err) {
        throw err;
    }
};

// Get the message history for a conversation
export const getMessageHistory = async (conversationId) => {
    try {
        const client = await pool.connect();
        log.info('[messageService]', 'get history');

        const result = await client.query(`
          SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC;`,
            [conversationId]
        );

        if (result.rowCount === 0) {
            return null;
        }

        const messages = result.rows;

        client.release();
        return messages;
    } catch (err) {
        throw err;
    }
};


// Insert a new message into the database
export const insertMessage = async (sender_id, receiver_id, message) => {
    try {
        const client = await pool.connect();
        const id = await client.query(`
        INSERT INTO messages(sender_id, receiver_id, message)
        VALUES($1, $2, $3)
        RETURNING id
        `, [sender_id, receiver_id, message]);

        log.info("message", id, "created");

        client.release();
        return id;
    } catch (err) {
        log.error('[messageService]', err);
        throw err;
    }
};


// Get all Messages of conversation from the database
export const getMessagesOfConversation = async (sender_id, receiver_id) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT * FROM messages
            WHERE (sender_id = $1
            AND receiver_id = $2)
            OR (sender_id = $2
            AND receiver_id = $1)`,
            [sender_id, receiver_id]);

        if (result.rowCount === 0) {
            return null;
        }

        client.release();
        return result.rows;
    } catch (err) {
        throw err;
    }
};


// Delete a block from the database
export const deleteConversation = async (sender_id, receiver_id) => {
    try {
        const client = await pool.connect();
        await client.query(`DELETE FROM messages
            WHERE (sender_id = $1
            AND receiver_id = $2)
            OR (sender_id = $2
            AND receiver_id = $1)`,
        [sender_id, receiver_id]);
        client.release();
    } catch (err) {
        throw err;
    }
};
