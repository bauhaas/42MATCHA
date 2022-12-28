import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import log from '../config/log.js';

// Create the conversations table
export async function createConversationTable() {
    try {
        const client = await pool.connect();

        const tableExists = await client.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'conversation';
    `);
        if (tableExists.rowCount === 0) {
            const result = await client.query(`
            CREATE TABLE conversation (
                id SERIAL PRIMARY KEY,
                sender_id INT NOT NULL,
                FOREIGN KEY (sender_id) REFERENCES users (id),
                receiver_id INT NOT NULL,
                FOREIGN KEY (receiver_id) REFERENCES users (id),
                message_history INT[]
              );
            `);
          log.info('[conversationModel.js]', result, 'conversation table have been created');
        }
        else {
          log.info('[conversationModel.js]', 'conversation table already exists - no need to create it');
        }
        client.release();
    } catch (err) {
      log.error('[conversationModel.js]', err);
    }
}
