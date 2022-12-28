import pool from '../config/db.js';
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import log from '../config/log.js';

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

    //TODO replace IF NOT EXIST INSTEAD OF tableExists
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
        sex_orientation VARCHAR(255),
        city VARCHAR(255),
        country TEXT,
        interests TEXT,
        photos TEXT,
        bio TEXT,
        active BOOLEAN,
        last_location POINT,
        fame_rating INT,
        report_count INT,
        status TIMESTAMPTZ NULL DEFAULT NOW()
      );
    `);
      log.info('[userModel.js]', result, 'user table have been created');}
    else {
      log.info('[userModel.js]', 'user table already exists - no need to create it');
    }
    client.release();
  } catch (err) {
    log.error('[userModel.js - create user table]', err);
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
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync('a', salt);

      const testUser = `
          INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            fame_rating,
            photos,
            last_location
          ) VALUES (
            'Baudoin',
            'Haas',
            'a@a.com',
            '${hash}',
            '0',
            'https://randomuser.me/api/portraits/men/17.jpg',
            POINT(2.318641, 48.896561)
          );
        `;
      await client.query(testUser);

      for (let i = 0; i < 500; i++) {
        const sex = faker.name.sex();
        const first_name = faker.name.firstName(sex).replace('\'', '');
        const last_name = faker.name.lastName(sex).replace('\'', '');
        const email = faker.internet.email(first_name, last_name);
        const password = faker.internet.password();
        const age = faker.datatype.number({ min: 18, max: 80})
        const city = faker.address.cityName().replace('\'', '');
        const country = faker.address.country().replace('\'', '');
        const fame_rating = Math.floor(Math.random() * 20);
        // const birthdate = faker.date.birthdate({refDate: Date});
        // const interests = faker.helpers.arrayElement(interestsAndHobbies, 3)
        const photos = faker.image.avatar();
        const bio = faker.lorem.lines(3).replace('\'', '');
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
            fame_rating,
            photos,
            bio,
            last_location
          ) VALUES (
            '${first_name}',
            '${last_name}',
            '${email}',
            '${password}',
            ${age},
            '${sex}',
            '${city}',
            '${country}',
            '${fame_rating}',
            '${photos}',
            '${bio}',
            POINT(${2.318641 - 2 + (4*Math.random())}, ${48.896561 - 2 + (4*Math.random())})
          );
        `;
        await client.query(query);
        }
      }
    else {
      log.info('[userModel.js]', 'user table already seeded - no need to seed');
    }
    client.release();
  } catch (err) {
    log.error('[userModel.js]', err);
  }
}