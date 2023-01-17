import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";

import pool from '../config/db.js';
import log from '../config/log.js';
import fs from 'fs';
// import { downloadAndStoreImageSeeding } from '../services/userService.js'

export async function createUsersTable() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
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
        seed_profile_avatar TEXT,
        bio TEXT,
        job TEXT,
        active BOOLEAN DEFAULT false,
        longitude FLOAT,
        latitude FLOAT,
        fame_rating INT DEFAULT 0,
        report_count INT DEFAULT 0,
        status TIMESTAMPTZ NULL DEFAULT NOW(),
        pin INTEGER DEFAULT NULL
      );
    `);
    client.release();
  } catch (err) {
    log.error('[userModel.js - create user table]', err);
  }
}

import request from 'request';


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

      for (let i = 0; i < 499; i++) {
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


        var interestsStr = "[";

        const commonHobbies = [
          "cinema",
          "test",
          "sport",
          "42",
          "party",
          "games",
          "swimming",
          "football",
          "paint",
          "museums",
          "beer",
          "restaurants",
          "travel",
          "food"];
        let randomCommon = commonHobbies.sort(() => .5 - Math.random()).slice(0,4)
        for (let i = 0; i < randomCommon.length; i++) {
          interestsStr += "\"" + randomCommon[i] + "\",";
        }

        const hobbies = ["bagarre", "flute", "contrebasse", "trompette", "aviation", "chanter", "danser", "courgette", "livre", "je suis un interet", "je suis un hobby"];
        let randomOther = hobbies.sort(() => .5 - Math.random()).slice(0,Math.floor(Math.random() * 6))
        for (let i = 0; i < randomOther.length; i++) {
          interestsStr += "\"" + randomOther[i] + "\",";
        }

        if (interestsStr !== "[") {
          interestsStr = interestsStr.slice(0, -1);
        }
        interestsStr += "]";

        const avatar_type = sex === "male" ? "man,boy,male" : "woman,girl,female";
        const seed_profile_avatar = faker.image.imageUrl(480, 480, avatar_type) // 'https://loremflickr.com/1234/2345/cat'
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
            seed_profile_avatar,
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
            '${seed_profile_avatar}',
            '${bio}',
            '${job}',
            '${interestsStr}',
            '${2.318641 - (i <= 400 ? 0.3 : 0.8) + ((i <= 400 ? 0.6 : 1.6)*Math.random())}',
            '${48.896561 - (i <= 400 ? 0.3 : 0.8) + ((i <= 400 ? 0.6 : 1.6)*Math.random())}',
            '${true}'
          ) RETURNING id;
        `;
        const res = await client.query(query);

        const url = seed_profile_avatar;
        const fileName = 'seed_profile_pic_' + res.rows[0].id;
        request.head(url, (err, res, body) => {
          request(url)
            .pipe(fs.createWriteStream(`uploads/${fileName}`))
            .on('close', () => {});
        });

        await client.query(`INSERT INTO user_files (user_id, file_path, is_profile_pic) VALUES ($1, $2, $3) RETURNING *;`, [ res.rows[0].id, 'uploads/'+fileName, true]);

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