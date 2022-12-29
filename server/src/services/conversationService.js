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


const getConversationCustom = async (id, userId1, userId2) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'get conversation');
        const result = await client.query(`
    SELECT conversation.id, conversation.userId1, conversation.userId2,
  user1.first_name || ' ' || user1.last_name as user1_name,
  user2.first_name || ' ' || user2.last_name as user2_name,
  (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message,
  (SELECT unread FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_unread
FROM conversation
JOIN users as user1 ON user1.id = conversation.userId1
JOIN users as user2 ON user2.id = conversation.userId2
WHERE conversation.id = $1 AND ((conversation.userId1 = $2 AND conversation.userId2 = $3) OR (conversation.userId1 = $3 AND conversation.userId2 = $2));
    `, [id, userId1, userId2]);
        const conversation = result.rows[0];
        client.release();
        return conversation;
    } catch (err) {
        throw err;
    }
};

// Insert a conv in the database
export const insertConversation = async (userId1, userId2) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'insert');

        // Check if a conversation already exists between the two users
        const result = await client.query(`
        SELECT * FROM conversation
        WHERE (userId1 = $1 AND userId2 = $2) OR (userId1 = $2 AND userId2 = $1)
        `, [userId1, userId2]);

        // If no conversation exists, insert a new one
        if (result.rowCount === 0) {
            const result = await client.query(`
            INSERT INTO conversation (userId1, userId2, message_history)
            VALUES ($1, $2, '{}') RETURNING *;`
            ,[userId1, userId2]);
            const conversation = result.rows[0];
            client.release();
            return getConversationCustom(conversation.id, userId1, userId2);

            // return conversation;
        } else {
            // If a conversation already exists, return it
            const conversation = result.rows[0];
            client.release();
            // return conversation;
            return getConversationCustom(conversation.id, userId1, userId2);
        }
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
  user1.first_name || ' ' || user1.last_name as user1_name,
  user2.first_name || ' ' || user2.last_name as user2_name,
  (SELECT message FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message,
  (SELECT sender_id FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_author_id,
  (SELECT unread FROM messages WHERE id = (SELECT max(id) FROM messages WHERE conversation_id = conversation.id)) as last_message_unread
FROM conversation
JOIN users as user1 ON user1.id = conversation.userId1
JOIN users as user2 ON user2.id = conversation.userId2
WHERE (conversation.userId1 = $1 OR conversation.userId2 = $1);`,
          [id]
        );
        const conversations = result.rows;
        client.release();
        return conversations;
    } catch (err) {
        throw err;
    }
};