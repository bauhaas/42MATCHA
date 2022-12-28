import pool from '../config/db.js';
import log from '../config/log.js';


// Delete a conv from the database
export const deleteConversation = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'delete');

        await client.query(
            `DELETE FROM conversation
            WHERE id = $1;`, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};


// Insert a conv in the database
export const insertConversation = async (sender_id, receiver_id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'insert');
        const result = await client.query(`
            INSERT INTO conversation (sender_id, receiver_id, message_history)
            VALUES ($1, $2, '{}') RETURNING id;`,
            [sender_id, receiver_id]);
        const conversationId = result.rows[0].id;
        client.release();
        return conversationId;
    } catch (err) {
        throw err;
    }
};

// Get all conv in the database from a user
export const getConversations = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'get');

        //chat gpted (si tu need des details je peux te filer les logs du chat)
        const result = await client.query(`
          SELECT conversation.id, conversation.sender_id, conversation.receiver_id, conversation.message_history,
            (CASE WHEN conversation.sender_id = $1 THEN sender.first_name || ' ' || sender.last_name ELSE users.first_name || ' ' || users.last_name END) as you_talk_to,
            (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message
          FROM conversation
          JOIN users ON users.id = (CASE WHEN conversation.sender_id = $1 THEN conversation.receiver_id ELSE conversation.sender_id END)
          JOIN users as sender ON sender.id = (CASE WHEN conversation.sender_id = $1 THEN conversation.sender_id ELSE conversation.receiver_id END)
          WHERE conversation.sender_id = $1 OR conversation.receiver_id = $1;`,
          [id]
        );
        const conversations = result.rows;
        client.release();
        return conversations;
    } catch (err) {
        throw err;
    }
};