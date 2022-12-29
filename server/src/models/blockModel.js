import pool from '../config/db.js';
import log from '../config/log.js';

export async function createBlocksTable() {
    try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS blocks (
            id SERIAL PRIMARY KEY,
            blocker_id INT NOT NULL,
            FOREIGN KEY (blocker_id) REFERENCES users (id),
            blocked_id INT,
            FOREIGN KEY (blocked_id) REFERENCES users (id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );`);
        log.info('[blockedModel.js]', 'blocks table have been created');
        client.release();
    } catch (err) {
      log.error('[blockedModel.js]', err);
    }
}
