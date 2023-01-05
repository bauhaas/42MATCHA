import pool from '../config/db.js';
import log from '../config/log.js';

export async function createFilesModel() {
    try {
        const client = await pool.connect();
        await client.query(`
        CREATE TABLE IF NOT EXISTS user_files (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            file_path VARCHAR(255)
          );`);
        log.info('[filesModel.js]', 'files table have been created');
        client.release();
    } catch (err) {
      log.error('[filesModel.js]', err);
    }
}
