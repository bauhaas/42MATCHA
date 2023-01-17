import { faker } from '@faker-js/faker';

import pool from '../config/db.js';
import log from '../config/log.js';

export async function createRelationsTable() {
    try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS relations (
            id SERIAL PRIMARY KEY,
            sender_id INT NOT NULL,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            receiver_id INT,
            FOREIGN KEY (receiver_id) REFERENCES users (id),
            type VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );`);
        client.release();
    } catch (err) {
      log.error('[relationModel.js]', err);
    }
}
