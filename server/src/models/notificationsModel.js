import pool from '../config/db.js';
import { faker } from '@faker-js/faker';

// Create the users table
export async function createNotificationsTable() {
    try {
        const client = await pool.connect();

        const tableExists = await client.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'notifications';
    `);
        if (tableExists.rowCount === 0) {
            const result = await client.query(`
            CREATE TABLE notifications (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id),
                sender_id INT,
                FOREIGN KEY (sender_id) REFERENCES users (id),
                type VARCHAR(255),
                read BOOLEAN,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            `);
            console.log(result, 'notifications table have been created');
        }
        else {
            console.log('notifications table already exists - no need to create it');
        }
        client.release();
    } catch (err) {
        console.error(err);
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
            user_id,
            sender_id,
            type,
            read
          ) VALUES (
            1,
            1,
            'welcome',
            false
          );
        `;
            await client.query(testNotifs);

            for (let i = 0; i < 10; i++) {
                const user_id = 1;
                const sender_id = 4;
                const type = faker.helpers.arrayElements(['like', 'block', 'view'],1);
                const read = faker.datatype.boolean();
                const query = `
          INSERT INTO notifications (
            user_id,
            sender_id,
            type,
            read
          ) VALUES (
            ${user_id},
            ${sender_id},
            '${type}',
            ${read}
          );
        `;
                await client.query(query);


            }
        }
        else {
            console.log('notifs table already seeded - no need to seed');
        }
        client.release();
    } catch (err) {
        console.error(err);
    }
}