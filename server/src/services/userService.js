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
export const insertUser = async (firstName, lastName, email, password) => {
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
    const result = await client.query(DBinsertUser(firstName, lastName, email, hash));
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