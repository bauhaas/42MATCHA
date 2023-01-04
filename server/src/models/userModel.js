import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";

import pool from '../config/db.js';
import log from '../config/log.js';

export async function createUsersTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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
        interests JSON,
        photos TEXT,
        bio TEXT,
        job TEXT,
        active BOOLEAN DEFAULT false,
        longitude FLOAT,
        latitude FLOAT,
        fame_rating INT,
        report_count INT,
        status TIMESTAMPTZ NULL DEFAULT NOW()
      );
    `);
    log.info('[userModel.js]', 'user table have been created');
    client.release();
  } catch (err) {
    log.error('[userModel.js - create user table]', err);
  }
}

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
      var hash = bcrypt.hashSync('42', salt);

      const testUser = `
          INSERT INTO users (
            first_name,
            last_name,
            sex,
            sex_orientation,
            email,
            password,
            fame_rating,
            photos,
            bio,
            job,
            interests,
            longitude,
            latitude,
            active
          ) VALUES (
            'Cat',
            'Norminet',
            'male',
            'hetero',
            '42@42.com',
            '${hash}',
            '0',
            'https://pbs.twimg.com/media/Db8uqDaX4AE6vA3.jpg:large',
            'Impossible to not like me',
            'Executive Cat',
            '["Sleeping"]',
            '2.318641',
            '48.896561',
            '1'
          );
        `;
      await client.query(testUser);

      for (let i = 0; i < 500; i++) {
        const sex = faker.name.sex();
        const first_name = faker.name.firstName(sex).replace('\'', '');
        const last_name = faker.name.lastName(sex).replace('\'', '');
        const email = faker.internet.email(first_name, last_name);
        const password = faker.internet.password();
        const age = faker.datatype.number({ min: 18, max: 80});
        const sex_orientation = faker.helpers.arrayElements(['hetero', 'homo', 'bi'],1);
        let city = faker.address.cityName().replace('\'', '');
        city = city.replace('\'', '');
        let country = faker.address.country().replace('\'', '');
        country = country.replace('\'', '');
        const fame_rating = Math.floor(Math.random() * 20);
        // const birthdate = faker.date.birthdate({refDate: Date});
        const hobbies = ["sport", "bagarre", "flute", "contrebasse", "trompette", "aviation", "chanter", "danser", "courgette", "livre", "je suis un interet", "je suis un hobby"];
        var interestsStr = "[";
        for (let i = 0; i < 3 + Math.floor(Math.random() * 6); i++) {
          var j = Math.floor(Math.random() * hobbies.length);
          interestsStr += "\"" + hobbies[j] + "\",";
        }
        if (interestsStr !== "[") {
          interestsStr = interestsStr.slice(0, -1);
        }
        interestsStr += "]";
        const photos = faker.image.avatar();
        const bio = faker.lorem.lines(3).replace('\'', '');
        const job = faker.name.jobTitle();
        const query = `
          INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            age,
            sex,
            sex_orientation,
            city,
            country,
            fame_rating,
            photos,
            bio,
            job,
            interests,
            longitude,
            latitude,
            active
          ) VALUES (
            '${first_name}',
            '${last_name}',
            '${email}',
            '${password}',
            ${age},
            '${sex}',
            '${sex_orientation}',
            '${city}',
            '${country}',
            '${fame_rating}',
            '${photos}',
            '${bio}',
            '${job}',
            '${interestsStr}',
            '${2.318641 - (i <= 400 ? 0.3 : 0.8) + ((i <= 400 ? 0.6 : 1.6)*Math.random())}',
            '${48.896561 - (i <= 400 ? 0.3 : 0.8) + ((i <= 400 ? 0.6 : 1.6)*Math.random())}',
            '${i <= 200 ? false : true}'
          );
        `;
        await client.query(query);
      }
      log.info('[userModel.js]', 'user table seeded');
    }
    else {
      log.info('[userModel.js]', 'user table already seeded - no need to seed');
    }
    client.release();
  } catch (err) {
    log.error('[userModel.js]', err);
  }
}