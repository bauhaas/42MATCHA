import pool from '../config/db.js';
import log from '../config/log.js';


// Delete a conv from the database
export const deleteConversation = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'deleteConversation');

        await client.query(
            `DELETE FROM conversations
            WHERE id = $1;`, [id]);
        client.release();
    } catch (err) {
        throw err;
    }
};


const getConversationCustom = async (id, userId1, userId2) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'getConversationCustom');
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
        log.info('[conversationService]', 'insertConversation');

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

// Get all conv in the database from a user
export const getConversations = async (id) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'getConversations');

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

export const deleteConversationOfPair = async (id1, id2) => {
    try {
        const client = await pool.connect();
        log.info('[conversationService]', 'deleteConversationOfPair');


        const convResult = await client.query(`
        SELECT id FROM conversation
        WHERE (userId1 = $1 AND userId2 = $1)
        OR (userId1 = $2 AND userId2 = $1);
        `
        , [id1, id2]);
        const conversation = convResult.rows[0];

        if (conversation === undefined) {
            return 0;
        }

        const messagesResult = await client.query(`
        SELECT id FROM messages
        WHERE (conversation_id = $1);
        `, [conversation]);

        const messagesIds = messagesResult.rows;

        for (let i = 0; i < messagesIds.length; i++) {
            await deleteMessage(messagesIds.id);
        }
        client.release();
        return messagesIds;
    } catch (err) {
        throw err;
    }
};