import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import log from '../config/log.js';

// Create the conversations table
export async function createConversationTable() {
    try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS conversation (
            id SERIAL PRIMARY KEY,
            userId1 INT NOT NULL,
            FOREIGN KEY (userId1) REFERENCES users (id),
            userId2 INT NOT NULL,
            FOREIGN KEY (userId2) REFERENCES users (id),
            message_history INT[]
          );`);
        client.release();
    } catch (err) {
      log.error('[conversationModel.js]', err);
    }
}
