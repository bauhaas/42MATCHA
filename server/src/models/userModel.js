import pool from '../config/db.js';
import { faker } from '@faker-js/faker';

const interestsAndHobbies = [
  'skiing',
  'hiking',
  'reading',
  'cooking',
  'painting',
  'gardening',
  'yoga',
  'meditation',
  'traveling',
  'fitness',
  'music',
  'movies',
  'dancing',
  'photography',
  'swimming',
  'camping'
];


// Create the users table
export async function createUsersTable() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INTEGER,
        sex VARCHAR(255),
        city VARCHAR(255),
        country TEXT,
        interests TEXT,
        photos TEXT,
        bio TEXT
      );
    `);
    console.log(result, 'user table have been created');
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
      const sex = faker.name.sex();
      const first_name = faker.name.firstName(sex);
      const last_name = faker.name.lastName(sex);
      const age = faker.datatype.number({ min: 18, max: 80})
      const city = faker.address.cityName();
      const country = faker.address.country();
      // const birthdate = faker.date.birthdate({refDate: Date});
      const interests = faker.helpers.arrayElement(interestsAndHobbies, 3)
      const photos = faker.image.avatar();
      const bio = faker.lorem.lines(8);
      const query = `
        INSERT INTO users (
          first_name,
          last_name,
          age,
          sex,
          city,
          country,
          interests,
          photos,
          bio
        ) VALUES (
          '${first_name}',
          '${last_name}',
          ${age},
          '${sex}',
          '${city}',
          '${country}',
          '${interests}',
          '${photos}',
          '${bio}'
        );
      `;
      await client.query(query);
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}