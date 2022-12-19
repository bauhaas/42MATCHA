import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import log from '../config/log.js';

// Create the blocks table
export async function createBlocksTable() {
    try {
        const client = await pool.connect();

        const tableExists = await client.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'blocks';
    `);
        if (tableExists.rowCount === 0) {
            const result = await client.query(`
            CREATE TABLE blocks (
                id SERIAL PRIMARY KEY,
                blocker_id INT NOT NULL,
                FOREIGN KEY (blocker_id) REFERENCES users (id),
                blocked_id INT,
                FOREIGN KEY (blocked_id) REFERENCES users (id),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            `);
          log.info('[blockedModel.js]', result, 'blocks table have been created');
        }
        else {
          log.info('[blockedModel.js]', 'blocks table already exists - no need to create it');
        }
        client.release();
    } catch (err) {
      log.error('[blockedModel.js]', err);
    }
}
