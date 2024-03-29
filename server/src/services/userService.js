import pool from '../config/db.js';
import { DBgetAllUsers, DBgetUserById, DBinsertUser, DBdeleteUser } from '../utils/queryUserUtils.js';
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import log from '../config/log.js';
import jwt from 'jsonwebtoken';
import  emailValidator from 'deep-email-validator';
import  fs from 'fs';
import request from 'request';
import { type } from 'os';
import { faker } from '@faker-js/faker';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/error.js';

export const updateProfilePicture = async (fileId, userId) => {
  const client = await pool.connect();
  try {

    await client.query(`
        UPDATE user_files SET is_profile_pic = $1 WHERE id = $2
      `, [true, fileId]);

    await client.query(`
    UPDATE user_files SET is_profile_pic = false WHERE id != $1 AND user_id = $2
  `, [fileId, userId]);

    const result = await client.query(`
      SELECT * FROM user_files WHERE user_id = $1
    `, [userId]);

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const getUserFiles = async (userId) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT * FROM user_files WHERE user_id = $1
    `, [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();

  }
};


export const deleteFile = async (id, userId) => {
  const client = await pool.connect();

  try {
    // Get the file path from the database
    const result = await client.query(`
      SELECT file_path FROM user_files WHERE id = $1
    `, [id]);
    const filePath = result.rows[0].file_path;
    // Delete the file from the filesystem
    fs.unlinkSync(filePath);
    // Delete the row from the user_files table
    await client.query(`
      DELETE FROM user_files WHERE id = $1
    `, [id]);

    // Check if there are any other files with is_profile_pic set to true
    const result2 = await client.query(`
      SELECT * FROM user_files WHERE is_profile_pic = $1 AND user_id = $2
    `, [true, userId]);

    if (result2.rowCount === 0) {
      // If there are no other files with is_profile_pic set to true, select a random file and set it as the profile picture
      const result3 = await client.query(`
        SELECT * FROM user_files WHERE user_id = $1 ORDER BY RANDOM() LIMIT 1
      `, [userId]);
      const randomFileId = result3.rows[0].id;
      await client.query(`
        UPDATE user_files SET is_profile_pic = $1 WHERE id = $2
      `, [true, randomFileId]);
    }

  } catch (error) {
    throw error;
  } finally {
    client.release();

  }
};

export const saveFile = async (userId, filePath, is_profile_pic) => {
  const client = await pool.connect();

  try {
    // Check if there are any existing rows for the user
    const result = await client.query(`
      SELECT COUNT(*) as count FROM user_files
      WHERE user_id = $1`
      , [userId]);
    const count = result.rows[0].count;
    // If it is the first row, set is_profile_pic to true
    if (count === '0') {
      is_profile_pic = 'true';
    }
    // Update previous rows to set is_profile_pic to false
    if (is_profile_pic == 'true') {
      await client.query(`
        UPDATE user_files
        SET is_profile_pic = $1
        WHERE user_id = $2
        AND is_profile_pic = $3
        `, [false, userId, true]);
    }
    // Insert new row
    const res = await client.query(`
      INSERT INTO user_files (user_id, file_path, is_profile_pic)
      VALUES ($1, $2, $3) RETURNING *;
      `, [userId, filePath, is_profile_pic]);
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();

  }
};

export const isActive = async (id) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT active from users
      WHERE id = $1
    `, [id]);
    return result;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

// Get all users from the database
export const getAllUsers = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query(DBgetAllUsers());
    const users = result.rows;
    return users;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Get bachelors from the database
export const getBachelors = async (id) => {
  const client = await pool.connect();

  try {
    const me = await getUserById(id);
    const result = await client.query(`
      SELECT users.*, SQRT(POWER(73 * ABS($2 - longitude), 2) + POWER(111 * ABS($3 - latitude), 2)) as distance, JSON_AGG(user_files.*) as files
      FROM users LEFT JOIN user_files ON users.id = user_files.user_id
      WHERE $1 != users.id
      AND SQRT(POWER(73 * ABS($2 - longitude), 2) + POWER(111 * ABS($3 - latitude), 2)) < 50
      AND users.active = true
      GROUP BY users.id
    `, [me.id, me.longitude, me.latitude]);

    var closeUsers = result.rows;

    if (["hetero", "homo"].includes(me.sex_orientation)) {
      const homo = me.sex_orientation == "homo";
      closeUsers = closeUsers.filter((user) => (homo ? user.sex === me.sex : user.sex !== me.sex) && user.sex_orientation === me.sex_orientation);
    } else {
      closeUsers = closeUsers.filter((user) => user.sex === me.sex ? user.sex_orientation !== "hetero" : user.sex_orientation !== "homo");
    }

    closeUsers.map(function (user) {
        const fameFactor = Math.max(1 - (0.02 * user.fame_rating), 0.5);
        const commonInterests = me.interests.filter(value => user.interests.includes(value));
        const interestsFactor = Math.max(1 - (0.1 * commonInterests.length), 0.5);

        const ageFactor = 1 - (Math.abs(me.age - user.age) / 100);

        user.attractivity = user.distance * fameFactor * interestsFactor * ageFactor;

        delete(user.pin);
        delete(user.email);
        delete(user.password);
        delete(user.report_count);
        return user;
    });

    closeUsers.sort((a, b) => a.attractivity - b.attractivity);

    return closeUsers;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Get bachelors with filters from the database
export const getFilteredBachelors = async (id, filters) => {
  const client = await pool.connect();

  try {
    const me = await getUserById(id);
    const result = await client.query(`
        SELECT users.*, SQRT(POWER(73 * ABS($2 - longitude), 2) + POWER(111 * ABS($3 - latitude), 2)) as distance, JSON_AGG(user_files.*) as files
        FROM users LEFT JOIN user_files ON users.id = user_files.user_id
        WHERE $1 != users.id
        AND SQRT(POWER(73 * ABS($2 - longitude), 2) + POWER(111 * ABS($3 - latitude), 2)) >= $4
        AND SQRT(POWER(73 * ABS($2 - longitude), 2) + POWER(111 * ABS($3 - latitude), 2)) <= $5
        AND age >= $6
        AND age <= $7
        AND fame_rating >= $8
        AND active = true
        GROUP BY users.id
      `, [me.id, me.longitude, me.latitude, filters.min_distance, filters.max_distance, filters.min_age, filters.max_age, filters.min_fame]);

    var filteredUsers = result.rows;

    if (["hetero", "homo"].includes(me.sex_orientation)) {
      const homo = me.sex_orientation === "homo";
      filteredUsers = filteredUsers.filter((user) => (homo ? user.sex === me.sex : user.sex !== me.sex) && user.sex_orientation === me.sex_orientation);
    } else {
      filteredUsers = filteredUsers.filter((user) => user.sex === me.sex ? user.sex_orientation !== "hetero" : user.sex_orientation !== "homo");
    }

    filteredUsers = filteredUsers.filter(function (user) {
        delete(user.pin);
        delete(user.email);
        delete(user.password);
        delete(user.report_count);

        const commonInterests = me.interests.filter(value => user.interests.includes(value));
        if (commonInterests.length >= filters.min_common_interests) {
          return true;
        }
        return false;
    });

    // sort by increasing distance
    filteredUsers.sort((a, b) => a.distance < b.distance);

    return filteredUsers;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Get user from database where email match the paramater
export const getLogin = async (email, password) => {
  const client = await pool.connect();

  try {

    const result = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    // If no user was found with the given email, throw an error
    if (result.rowCount === 0) {
      log.error('[userService]', 'didnt find user with that mail');
      throw new UnauthorizedError('Invalid email or password');
    }

    // Get the user from the result
    const id = result.rows[0].id;

    const t = await client.query(`
      SELECT users.*, JSON_AGG(user_files.*) as files
      FROM users LEFT JOIN user_files ON users.id = user_files.user_id
      WHERE users.id = $1
      GROUP BY users.id
    `, [id]);

    const user = t.rows[0];


    // Compare the given password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, throw an error
    if (!passwordMatch) {
      log.error('[userService]', 'pass didnt match');
      throw new UnauthorizedError('Invalid email or password');
    }

    // If the user isn't active (no profile pic)
    if (!user.active) {
      log.error('[userService]', 'no profile pic on signin');
      throw new ForbiddenError('No profile picture uploaded via the email link, please add a picture on the form in link');
    }

    return user;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Get a user by their ID from the database
export const getUserById = async (id) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT users.*, JSON_AGG(user_files.*) as files
      FROM users LEFT JOIN user_files ON users.id = user_files.user_id
      WHERE users.id = $1
      GROUP BY users.id
    `, [id]);
    const user = result.rows[0];

    return user;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Get a user by their ID from the database
export const getUserByIdProfile = async (id) => {
  const client = await pool.connect();

  try {

    const result = await client.query(`
      SELECT users.*, JSON_AGG(user_files.*) as files
      FROM users LEFT JOIN user_files ON users.id = user_files.user_id
      WHERE users.id = $1
      GROUP BY users.id
    `, [id]);

    const user = result.rows[0];
    if(user.files[0] === null)
      user.files = null;

    delete(user.email);
    delete(user.password);
    delete(user.report_count);
    delete(user.pin);
    return user;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const sendPasswordEmail = async (email, first_name, password) => {
  const transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    }
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Matcha" <matcha@noreply.com>',
    to: email,
    subject: "Change your password",
    text: `Hi ${first_name},\n\nHere is your temporary password: ${password}\nPlease change it quickly :)\n— Matcha`,
  });

};

// Get user from database where email match the paramater
export const handleForgottenPassword = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    // If no user was found with the given email, throw an error
    if (result.rowCount === 0) {
      log.error('[userService]', 'didnt find user with that mail');
      throw new NotFoundError('Invalid email or password');
    }

    var pwd              = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
      pwd += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    await sendPasswordEmail(email, result.rows[0].first_name, pwd);

    var salt = bcrypt.genSaltSync(10);
    var newHash = bcrypt.hashSync(pwd, salt);
    const resUpdate = await client.query(' \
      UPDATE users \
      SET password = $1 \
      WHERE id = $2 \
      RETURNING *;', [
        newHash, result.rows[0].id
    ]);
  } catch (err) {
    throw err;
  } finally {
      client.release();
  }
}

// Get user from database where email match the paramater
export const resendSignupEmail = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    // If no user was found with the given email, throw an error
    if (result.rowCount === 0) {
      log.error('[userService]', 'didnt find user with that mail');
      throw new NotFoundError('Invalid email or password');
    }

    const emailValidation = await isEmailValid(email);
    if (emailValidation.valid === false) {
      throw new Error('Email format is invalid');
    }

    const user = result.rows[0];
    const accessToken = generateAccessToken(result.rows[0]);
    await sendConfirmationEmail(email, user.firstName, user.lastName, accessToken);
  } catch (err) {
    throw err;
  } finally {
      client.release();
  }
}

const sendResetPIN = async (email, firstName, lastName, id) => {
  const transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    }
  );

  const pin = Math.floor(Math.random() * 9999);
  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Matcha" <matcha@noreply.com>',
    to: email,
    subject: "Matcha password change",
    text: "Hi " + firstName + " " + lastName + `,\n\nHere is your code to validate your new password ${pin}\n— Matcha`,
  });


  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE users
      SET pin = $1
      WHERE id = $2
      RETURNING *;
    `, [pin, id]);
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export const resetPassword = async (oldPassword, user) => {
  try {

    // Compare the given password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    // If the passwords don't match, throw an error
    if (!passwordMatch) {
      log.error('[userService]', 'pass didnt match');
      throw new UnauthorizedError('Invalid  password');
    } else {
      await sendResetPIN(user.email, user.first_name, user.last_name, user.id);
      return "ok";
    }
  } catch (err) {
    throw err;
  }
};

export const validateNewPassword = async (newPassword, pin, user) => {
  const client = await pool.connect();

  try {

    // Compare the given password with the hashed password in the database

    // If the passwords don't match, throw an error
    if (pin !== user.pin) {
      throw new UnauthorizedError('wrong PIN');
    } else {

      var salt = bcrypt.genSaltSync(10);
      var newHash = bcrypt.hashSync(newPassword, salt);
      const result = await client.query(
        'UPDATE users \
        SET password = $1 \
        WHERE id = $2',
        [newHash, user.id]
      );

      const result2 = await client.query(' \
        UPDATE users SET \
        pin = NULL \
        WHERE id = $1 \
        RETURNING *;',
        [user.id]);
    }
    return ;
  } catch (err) {
    throw err;
  } finally {
    client.release();

  }
};


function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10000s' });
}

export const sendConfirmationEmail = async (email, firstName, lastName, accessToken) => {
  const transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    }
  );

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Matcha" <matcha@noreply.com>',
    to: email,
    subject: "Confirm your Matcha account",
    text: "Hi " + firstName + " " + lastName + `,\n\nIn order to get full access to Matcha features, you need to confirm your email address by following the link below.\nhttp://localhost:3000/activation?token=${accessToken}\n— Matcha`,
  });

};

const isEmailValid = async (email) => {
  return emailValidator.validate(email)
}

// Insert a new user into the database
export const insertUser = async (firstName, lastName, email, password, longitude, latitude) => {
  const client = await pool.connect();

  try {
    const dupplicateEmailResult = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    if (dupplicateEmailResult.rowCount > 0)
      throw new ForbiddenError('A user with the given email already exists');

    const emailValidation = await isEmailValid(email);
    if (emailValidation.valid === false) {
      throw new Error('Email format is invalid');
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const result = await client.query(DBinsertUser(firstName, lastName, email, hash, longitude, latitude));
    const user = result.rows[0];
    const accessToken = generateAccessToken(result.rows[0]);
    await sendConfirmationEmail(email, firstName, lastName, accessToken);
    return accessToken;
  } catch (err) {
    throw err;
  } finally {
    client.release();

  }
};

export const updateUserFameRating = async (id, bool) => {
  const client = await pool.connect();

  try {

    const user = await getUserById(id);
    var newFame = user.fame_rating;
    if (bool === true) {
      newFame++
    } else {
      newFame--;
    }
    const result = await client.query(`
    UPDATE users SET
    fame_rating = $1
    WHERE id = $2
    RETURNING *;`, [
      newFame,
      id
    ]);
    const newUser = result.rows[0];
    return newUser;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  } finally {
    client.release();
}
};

// Update user in db
export const updateUser = async (data) => {
  const client = await pool.connect();

  try {

    const emailValidation = await isEmailValid(data.email);
    if (emailValidation.valid === false) {
      throw new BadRequestError('Email format is invalid');
    }

    var interestsStr = "[";
    for (let i = 0; i < data.interests.length; i++) {
      interestsStr += "\"" + data.interests[i] + "\",";
    }
    if (interestsStr !== "[") {
      interestsStr = interestsStr.slice(0, -1);
    }
    interestsStr += "]";
    const result = await client.query(`
      UPDATE users SET
      first_name = $1,
      last_name = $2,
      email = $3,
      password = $4,
      age = $5,
      sex = $6,
      sex_orientation = $7,
      city = $8,
      country = $9,
      interests = $10,
      bio = $11,
      active = $12,
      report_count = $13
      WHERE id = $14
      RETURNING *;`, [
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.age,
      data.sex,
      data.sex_orientation,
      data.city,
      data.country,
      interestsStr,
      data.bio,
      data.active,
      data.report_count,
      data.id
    ]);

    const resultUpdate = await client.query(`
      SELECT users.*, JSON_AGG(user_files.*) as files
      FROM users LEFT JOIN user_files ON users.id = user_files.user_id
      WHERE users.id = $1
      GROUP BY users.id
    `, [data.id]);

    const user = resultUpdate.rows[0];

    return user;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  } finally {
    client.release();

  }
};


const downloadFile = async (url, fileName) => {
  return new Promise((resolve, reject) => {
    request.head(url, (err, res, body) => {
      if (err) {
        reject(err);
      }

      request(url)
        .pipe(fs.createWriteStream(`uploads/${fileName}`))
        .on("close", () => {
          resolve();
        });
    });
  });
};

// Insert a new user into the database
export const CreateFakeUser = async (fakeUser, longitude, latitude) => {
  const client = await pool.connect();

  try {
    var salt = bcrypt.genSaltSync(10);
    var fakeHash = bcrypt.hashSync(fakeUser, salt);

    const fakeMail = fakeUser + "@" + fakeUser + ".com" ;
    const res = await client.query(`
      INSERT INTO users (first_name, last_name, email, password, age, sex, sex_orientation, city, country, interests, bio, active, fame_rating, report_count, longitude, latitude, job)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `, [fakeUser, fakeUser, fakeMail, fakeHash, 20, "male", "hetero", "Paris", "France", '["coding"]', fakeUser, true, 0, 0, longitude, latitude, 'student']);

    const seed_profile_avatar = faker.image.imageUrl(480, 480, 'man,boy,male') // 'https://loremflickr.com/1234/2345/cat'
    const url = seed_profile_avatar;
    const fileName = 'fake_profile_pic_' + res.rows[0].id;

    await downloadFile(url, fileName);
    await client.query(`INSERT INTO user_files (user_id, file_path, is_profile_pic) VALUES ($1, $2, $3) RETURNING *;`, [ res.rows[0].id, 'uploads/'+fileName, true]);

    const t = await client.query(`
    SELECT users.*, JSON_AGG(user_files.*) as files
    FROM users LEFT JOIN user_files ON users.id = user_files.user_id
    WHERE users.id = $1
    GROUP BY users.id
        `, [res.rows[0].id]);

    return t.rows[0];
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  } finally {
    client.release();
  }
};

// Delete a user from the database
export const deleteUser = async (id) => {
  const client = await pool.connect();

  try {
    await client.query(DBdeleteUser(id));
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};


// update status in user
export const updateStatusUser = async (id, status) => {
  const client = await pool.connect();

  try {

    if (status === false) {
      const result = await client.query(`
        UPDATE users SET
        status = NOW()
        WHERE id = $1
        RETURNING *;`, [
          id
      ]);
      const user = result.rows[0];

      return user;
    } else if (status === true) {
      const result = await client.query(`
      UPDATE users SET
      status = NULL
      WHERE id = $1
      RETURNING *;`, [
        id
    ]);
    const user = result.rows[0];

    return user;
  }
    throw new Error("wrong value for status");;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  } finally {
    client.release();
  }
};

export const getLikedUsers = async (id) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT id, first_name FROM users
      WHERE id IN (
        SELECT receiver_id FROM relations
        WHERE sender_id = $1 AND type = 'like'
      )
    `, [id]);
    const users = result.rows;
    return users;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export const getMatchedUsers = async (id) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT * FROM users
      WHERE id IN (
        SELECT receiver_id FROM relations
        WHERE sender_id = $1 AND type = 'match'
      )
    `, [id]);
    const users = result.rows;
    return users;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export const getBlockedUsers = async (id) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT * FROM users
      WHERE id IN (
        SELECT receiver_id FROM relations
        WHERE sender_id = $1 AND type = 'block'
      )
    `, [id]);
    const users = result.rows;
    return users;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}
