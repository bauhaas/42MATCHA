import pool from '../config/db.js';
import log from '../config/log.js';

export async function createMessagesTable() {
    try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_id INT NOT NULL,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            conversation_id INT NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversation (id),
            message VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            unread BOOLEAN NOT NULL DEFAULT TRUE
          );`);
        log.info('[messageModel.js]', 'messages table have been created');
        client.release();
    } catch (err) {
      log.error('[messageModel.js]', err);
    }
}
