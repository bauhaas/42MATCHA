import pool from '../config/db.js';
import { DBgetAllUsers, DBgetUserById, DBinsertUser, DBupdateUser, DBdeleteUser } from '../utils/queryUserUtils.js';
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import log from '../config/log.js';

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
    // console.log(result);


    // If no user was found with the given email, throw an error
    if (result.rowCount === 0) {
      console.log('didnt find user with that mail');
      throw new Error('Invalid email or password.');
    }

    // Get the user from the result
    const user = result.rows[0];

    // Compare the given password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, throw an error
    if (!passwordMatch) {
      console.log('pass didnt match');
      throw new Error('Invalid email or password.');
    }

    // // Generate a JWT for the user
    // const token = jwt.sign({ email: email }, 'secret-key', {
    //   expiresIn: '1h'
    // });

    // // Return the JWT to the caller
    // return token;
    return user;
  } catch (err) {
    // console.log(err);
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

// A function to send a confirmation email to the given email address
export const sendConfirmationEmail = async (email, firstName, lastName) => {

  // create reusable transporter object using the default SMTP transport
   // pzigpoonkihuymeq
  let transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: 'baudoin.haas@gmail.com',
        pass: 'pzigpoonkihuymeq'
      }
    }
  );

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Matcha" <matcha@noreply.com>', // sender address
    to: email, // list of receivers
    subject: "Confirm your Matcha account", // Subject line
    text: "Hi " + firstName + " " + lastName + ",\n\nIn order to get full access to Matcha features, you need to confirm your email address by following the link below.\nhttp://localhost:3000/home\n— Matcha", // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
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
    // If a user with the given email already exists, throw an error
    if (dupplicateEmailResult.rowCount > 0) {
      throw new Error('A user with the given email already exists.');
    }

    // Send the confirmation email
    await sendConfirmationEmail(email, firstName, lastName);

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    console.log('gonna insert the user');
    const result = await client.query(DBinsertUser(firstName, lastName, email, hash));
    const id = result.rows[0].id;
    client.release();
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Update a user's information in the database
export const updateUser = async (name, age, id) => {
  try {
    const client = await pool.connect();
    await client.query(DBupdateUser(name, age, id));
    client.release();
  } catch (err) {
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