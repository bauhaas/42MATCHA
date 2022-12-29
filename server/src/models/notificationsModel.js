import { faker } from '@faker-js/faker';

import pool from '../config/db.js';
import log from '../config/log.js';

export async function createNotificationsTable() {
    try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            sender_id INT NOT NULL,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            receiver_id INT,
            FOREIGN KEY (receiver_id) REFERENCES users (id),
            type VARCHAR(255),
            read BOOLEAN,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );`);
        log.info('[notifModel.js]', 'notifications table have been created');
        client.release();
    } catch (err) {
      log.error('[notifModel.js]', err);
    }
}



// Seed the users table with fake data
export async function seedNotificationsTable() {
    try {
        const client = await pool.connect();

        // Check if the 'users' table has any rows
        const tableIsEmpty = await client.query(`
          SELECT *
          FROM notifications
          LIMIT 1;
        `);

        if (tableIsEmpty.rowCount === 0) {

            const testNotifs = `
          INSERT INTO notifications (
            sender_id,
            receiver_id,
            type,
            read
          ) VALUES (
            1,
            1,
            'test',
            false
          );
        `;
          await client.query(testNotifs);

            for (let i = 0; i < 300; i++) {
                const sender_id = Math.floor(Math.random() * 10) + 1;
                const receiver_id = Math.floor(Math.random() * 10) + 1;
                const type = faker.helpers.arrayElements(['like', 'visit', 'match'],1);
                const read = faker.datatype.boolean();
                const query = `
                INSERT INTO notifications (
                  sender_id,
                  receiver_id,
                  type,
                  read
                ) VALUES (
                  ${sender_id},
                  ${receiver_id},
                  '${type}',
                  ${read}
                );
              `;
                await client.query(query);
            }
        }
        else {
          log.info('[notifModel.js]', 'notifs table already seeded - no need to seed');
        }
        client.release();
    } catch (err) {
      log.error('[notifModel.js]', err);
    }
}