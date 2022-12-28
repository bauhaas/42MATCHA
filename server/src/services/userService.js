import pool from '../config/db.js';
import { DBgetAllUsers, DBgetUserById, DBinsertUser, DBdeleteUser } from '../utils/queryUserUtils.js';
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import log from '../config/log.js';
import jwt from 'jsonwebtoken';

// Get all users from the database
export const getAllUsers = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query(DBgetAllUsers());
    const users = result.rows;
    client.release();
    return users;
  } catch (err) {
    throw err;
  }
};

// Get all users from the database
export const getBachelors = async (id, page) => {
  try {

    const client = await pool.connect();
    const me = await getUserById(id);
    console.log("me", me)
    const result = await client.query(`
      SELECT *, ABS($1 - ST_X(last_location::geometry)) + ABS($2 - ST_Y(last_location::geometry)) as distance
      FROM users
      WHERE ABS($1 - ST_X(last_location::geometry)) + ABS($2 - ST_Y(last_location::geometry)) <= 1
    `, [me.last_location.x , me.last_location.y]);

    const closeUsers = result.rows;
    console.log("length", closeUsers.length);

    client.release();
    return closeUsers;
  } catch (err) {
    throw err;
  }
};

// Get user from database where email match the paramater
export const getLogin = async (email, password) => {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    // If no user was found with the given email, throw an error
    if (result.rowCount === 0) {
      log.error('[userService]', 'didnt find user with that mail');
      throw new Error('Invalid email or password.');
    }

    // Get the user from the result
    const user = result.rows[0];

    // Compare the given password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, throw an error
    if (!passwordMatch) {
      log.error('[userService]', 'pass didnt match');
      throw new Error('Invalid email or password .');
    }

    return user;
  } catch (err) {
    throw err;
  }
};

// Get a user by their ID from the database
export const getUserById = async (id) => {
  try {
    const client = await pool.connect();
    const result = await client.query(DBgetUserById(id));
    const user = result.rows[0];
    client.release();
    return user;
  } catch (err) {
    throw err;
  }
};

// Get a user by their ID from the database
export const getUserByIdProfile = async (id) => {
  try {
    const client = await pool.connect();
    const result = await client.query(DBgetUserById(id));
    const user = result.rows[0];
    delete(user.email);
    delete(user.password);
    delete(user.report_count);
    client.release();
    return user;
  } catch (err) {
    throw err;
  }
};

export const resetPassword = async (oldPassword, newPassword, user) => {
  try {
    log.info('[userService]', 'resetPassword');

    // Compare the given password with the hashed password in the database
    log.info('[userService]', 'old:',oldPassword, ', new:', newPassword);
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    // If the passwords don't match, throw an error
    if (!passwordMatch) {
      log.error('[userService]', 'pass didnt match');
      throw new Error('Invalid email or password .');
    }
    else
    {
      var salt = bcrypt.genSaltSync(10);
      var newHash = bcrypt.hashSync(newPassword, salt);
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [newHash, user.id]
      );
      client.release();
    }
  } catch (err) {
    throw err;
  }
};


function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}


// Send a confirmation email to the given email address
export const sendConfirmationEmail = async (email, firstName, lastName, accessToken) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: 'baudoin.haas@gmail.com', //that too
        pass: 'pzigpoonkihuymeq' //TODO woopsy move to .env
      }
    }
  );

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Matcha" <matcha@noreply.com>', // sender address
    to: email, // list of receivers
    subject: "Confirm your Matcha account", // Subject line
    text: "Hi " + firstName + " " + lastName + `,\n\nIn order to get full access to Matcha features, you need to confirm your email address by following the link below.\nhttp://localhost:3000/profile?token=${accessToken}\n— Matcha`, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  log.info('[userService]', "Message sent: %s", info.messageId);
};


// Insert a new user into the database
export const insertUser = async (firstName, lastName, email, password, position) => {
  try {
    const client = await pool.connect();

    const dupplicateEmailResult = await client.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);

    if (dupplicateEmailResult.rowCount > 0)
      throw new Error('A user with the given email already exists.');


    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    log.info('[userService]', 'gonna insert the user');
    const result = await client.query(DBinsertUser(firstName, lastName, email, hash, position.longitude, position.latitude));
    log.info('[userService]', JSON.stringify(result.rows[0], null,2));
    const id = result.rows[0].id;

    const accessToken = generateAccessToken(result.rows[0]);

    await sendConfirmationEmail(email, firstName, lastName, accessToken);

    client.release();
    return id;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  }
};

export const updateUserFameRating = async (id, bool) => {try {
  const client = await pool.connect();
  const user = await getUserById(id);
  var newFame = user.fame_rating;
  if (bool === true) {
    newFame++
  } else {
    newFame--;
  }
  log.info('[userService]', 'gonna update the fame_rating user');
  const result = await client.query(`
  UPDATE users SET
  fame_rating = $1
  WHERE id = $2
  RETURNING *;`, [
    newFame,
    id
  ]);
  const newUser = result.rows[0];
  console.log(newUser);
  client.release();
  return newUser;
} catch (err) {
  log.error('[userService]', err);
  throw err;
}
};

// Update user in db
export const updateUser = async (data) => {
  try {
    const client = await pool.connect();

    log.info(data);
    log.info('[userService]', 'gonna update the user');
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
    photos = $11,
    bio = $12,
    active = $13,
    report_count = $14
    WHERE id = $15
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
      data.interests,
      data.photos,
      data.bio,
      data.active,
      data.report_count,
      data.id
    ]);
    const user = result.rows[0];

    client.release();
    return user;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  }
};

// Insert a new user into the database
export const CreateFakeUser = async (fakeUser, position) => {
  try {
    const client = await pool.connect();

    var salt = bcrypt.genSaltSync(10);
    var fakeHash = bcrypt.hashSync(fakeUser, salt);

    log.info('[userService]', 'gonna insert the fake user');
    const fakeMail = fakeUser + "@" + fakeUser + ".com" ;
    const result = await client.query(`
    INSERT INTO users (first_name, last_name, email, password, age, sex, sex_orientation, city, country, interests, photos, bio, active, fame_rating, report_count, last_location)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, POINT($16, $17))
    RETURNING *;
  `, [fakeUser, fakeUser, fakeMail, fakeHash, 20, "man", "hetero", "Paris", "France", "test_interets", "", fakeUser, true, 0, 0, position.longitude, position.latitude]);
    log.info('[userService]', JSON.stringify(result.rows[0], null,2));

    client.release();
    return result.rows[0];
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  }
};

// Delete a user from the database
export const deleteUser = async (id) => {
  try {
    const client = await pool.connect();
    await client.query(DBdeleteUser(id));
    client.release();
  } catch (err) {
    throw err;
  }
};


// update status in user
export const updateStatusUser = async (id, status) => {
  try {
    const client = await pool.connect();

    log.info('[userService]', id, status);
    log.info('[userService]', 'gonna update user status/time connected');
    if (status === false) {
      log.info('[userService]', "set to now()");
      const result = await client.query(`
        UPDATE users SET
        status = NOW()
        WHERE id = $1
        RETURNING *;`, [
          id
      ]);
      const user = result.rows[0];

      client.release();
      return user;
    } else if (status === true) {
      log.info('[userService]', "set to null");
      const result = await client.query(`
      UPDATE users SET
      status = NULL
      WHERE id = $1
      RETURNING *;`, [
        id
    ]);
    const user = result.rows[0];

    client.release();
    return user;
  }
    throw new Error("wrong value for status");;
  } catch (err) {
    log.error('[userService]', err);
    throw err;
  }
};

export const getLikedUsers = async (id) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM users
      WHERE id IN (
        SELECT receiver_id FROM notifications
        WHERE sender_id = $1 AND type = 'like'
      )
    `, [id]);
    const users = result.rows;
    client.release();
    return users;
  } catch (err) {
    throw err;
  }
}

export const getMatchedUsers = async (id) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM users
      WHERE id IN (
        SELECT receiver_id FROM notifications
        WHERE sender_id = $1 AND type = 'match'
      )
    `, [id]);
    const users = result.rows;
    client.release();
    return users;
  } catch (err) {
    throw err;
  }
}
