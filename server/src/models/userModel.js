import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";

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

    const tableExists = await client.query(`
      SELECT *
      FROM information_schema.tables
      WHERE table_name = 'users';
    `);

    //TODO replace IF NOT EXIST INSTEADODTABLE EXIST
    if (tableExists.rowCount === 0) {
    const result = await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INTEGER,
        sex VARCHAR(255),
        city VARCHAR(255),
        country TEXT,
        interests TEXT,
        photos TEXT,
        bio TEXT
      );
    `);
    console.log(result, 'user table have been created');}
    else {
      console.log('user table already exists - no need to create it');
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}

// Seed the users table with fake data
export async function seedUsersTable() {
  try {
    const client = await pool.connect();

    // Check if the 'users' table has any rows
    const tableIsEmpty = await client.query(`
      SELECT *
      FROM users
      LIMIT 1;
    `);

    if (tableIsEmpty.rowCount === 0) {
      // Generate 10 fake users
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync('a', salt);

      const testUser = `
          INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            photos
          ) VALUES (
            'Baudoin',
            'Haas',
            'a@a.com',
            '${hash}',
            'https://randomuser.me/api/portraits/men/17.jpg'
          );
        `;
      await client.query(testUser);

      for (let i = 0; i < 10; i++) {
        const sex = faker.name.sex();
        const first_name = faker.name.firstName(sex);
        const last_name = faker.name.lastName(sex);
        const email = faker.internet.email(first_name, last_name);
        const password = faker.internet.password();
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
            email,
            password,
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
            '${email}',
            '${password}',
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
      }
    else {
      console.log('user table already seeded - no need to seed');
    }
    client.release();
  } catch (err) {
    console.error(err);
  }
}