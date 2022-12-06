import pool from '../config/db.js';
import { DBgetAllUsers, DBgetUserById, DBinsertUser, DBupdateUser, DBdeleteUser } from '../utils/queryUserUtils.js';

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

// Insert a new user into the database
export const insertUser = async (name, age) => {
  try {
    const client = await pool.connect();
    const result = await client.query(DBinsertUser(name, age));
    const id = result.rows[0].id;
    client.release();
    return id;
  } catch (err) {
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