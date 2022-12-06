import pool from '../config/db.js';
import { faker } from '@faker-js/faker';

// Create the users table
export async function createUsersTable() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
      );
    `);
    console.log(result);
    client.release();
  } catch (err) {
    console.error(err);
  }
}

// Seed the users table with fake data
export async function seedUsersTable() {
  try {
    const client = await pool.connect();
    // Generate 10 fake users
    for (let i = 0; i < 10; i++) {
      const name = faker.name.fullName();
      const age = faker.random.numeric(2);
      const query = `
        INSERT INTO users (name, age)
        VALUES ('${name}', ${age});
      `;
      await client.query(query);
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}