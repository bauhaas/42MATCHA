import pool from '../config/db.js';
import log from '../config/log.js';

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
