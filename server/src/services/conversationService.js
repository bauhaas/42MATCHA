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
export const insertConversation = async (userId1, userId2) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'insert');
        const result = await client.query(`
            INSERT INTO conversation (userId1, userId2, message_history)
            VALUES ($1, $2, '{}') RETURNING id;`,
            [userId1, userId2]);
        const conversationId = result.rows[0].id;
        client.release();
        return conversationId;
    } catch (err) {
        throw err;
    }
};


// // Patch a conv in the database
// export const patchConversation = async (id, unread) => {
//     try {
//         const client = await pool.connect();
//         log.info('[conversationService]', 'patch', id, unread);
//         const result = await client.query('UPDATE conversation SET unread = false WHERE id = $1;', [id]);
//         log.info('[conversationService]', 'patch done');
//         client.release();
//     } catch (err) {
//         throw err;
//     }
// };


// Get all conv in the database from a user
export const getConversations = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'get');

        //chat gpted (si tu need des details je peux te filer les logs du chat)
        const result = await client.query(`
          SELECT conversation.id, conversation.userId1, conversation.userId2,
            (CASE WHEN conversation.userId1 = $1 THEN sender.first_name || ' ' || sender.last_name ELSE users.first_name || ' ' || users.last_name END) as you_talk_to,
            (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message,
            (SELECT unread FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_unread
          FROM conversation
          JOIN users ON users.id = (CASE WHEN conversation.userId1 = $1 THEN conversation.userId2 ELSE conversation.userId1 END)
          JOIN users as sender ON sender.id = (CASE WHEN conversation.userId1 = $1 THEN conversation.userId1 ELSE conversation.userId2 END)
          WHERE conversation.userId1 = $1 OR conversation.userId2 = $1;`,
          [id]
        );
        const conversations = result.rows;
        client.release();
        return conversations;
    } catch (err) {
        throw err;
    }
};