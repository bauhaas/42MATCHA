import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import log from '../config/log.js';

// Create the messages table
export async function createMessagesTable() {
    try {
        const client = await pool.connect();

        const tableExists = await client.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'messages';
    `);
        if (tableExists.rowCount === 0) {
            const result = await client.query(`
            CREATE TABLE messages (
              id SERIAL PRIMARY KEY,
              sender_id INT NOT NULL,
              FOREIGN KEY (sender_id) REFERENCES users (id),
              conversation_id INT NOT NULL,
              FOREIGN KEY (conversation_id) REFERENCES conversation (id),
              message VARCHAR(255),
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              unread BOOLEAN NOT NULL DEFAULT TRUE
            );
            `);
          log.info('[messageModel.js]', result, 'messages table have been created');
        }
        else {
          log.info('[messageModel.js]', 'messages table already exists - no need to create it');
        }
        client.release();
    } catch (err) {
      log.error('[messageModel.js]', err);
    }
}
