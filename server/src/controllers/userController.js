import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { resendSignupEmail, updateProfilePicture, deleteFile, getUserFiles, isActive, saveFile, getFilteredBachelors, getAllUsers, getUserById, insertUser, updateUser, deleteUser, getLogin, CreateFakeUser, resetPassword, getLikedUsers, getMatchedUsers, getUserByIdProfile, getBachelors, getBlockedUsers } from '../services/userService.js';
import { authenticateToken } from '../middleware/authMiddleware.js'
import { isBlocked } from '../services/relationsService.js';
import log from '../config/log.js';
import fs from 'fs';
// import fetch from 'node-fetch';

import multer from 'multer';
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import { readChunk } from 'read-chunk';
import { BadRequestError, ForbiddenError, NotFoundError, sendErrorResponse } from '../errors/error.js';


const router = express.Router();

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const upload = multer({
  dest: 'uploads/',
  fileFilter: async (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      console.log('invalid type');
      return cb({ message: 'Invalid file type', status: 400 }, false);
    }
    cb(null, true);
  }
});

const errorHandler = (error, req, res, next) => {
  if (error) {
    return res.status(error.status || 500).send({ message: error.message });
  }
  next();
};

router.post('/:id/upload', async (req, res, next) => {
  // Check if the user has exceeded the maximum number of allowed files
  const userId = req.params.id;
  console.log(userId, req.file, req);
  const maxFiles = 5; // Maximum number of allowed files per user
  const client = await pool.connect();
  const result = await client.query(`
    SELECT COUNT(*) as count FROM user_files WHERE user_id = $1
  `, [userId]);
  const count = result.rows[0].count;
  console.log('count:', count);
  if (count >= maxFiles) {
    return res.status(400).send({ message: `You have already reached the maximum number of allowed files (${maxFiles})` });
  }
  // Pass the request to the next middleware
  next();
}, upload.single('file'), errorHandler, async (req, res) => {
  // Save the file to the database
  console.log(req.file, 'file');
  const filePath = req.file.path;
  const userId = req.params.id;
  const is_profile_pic = req.body.is_profile_pic;
  const result = await saveFile(userId, filePath, is_profile_pic);
  // Send the file back to the client
  res.send(result);
});


router.get('/files/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const files = await getUserFiles(userId);
    res.send(files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/files/:id/:userId', async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;
    await deleteFile(id, userId);
    res.send({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



router.get('/:id/bachelors/', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    const users = await getBachelors(id);
    res.send(users);
  } catch (err) {
    console.log(err);
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

router.post('/:id/filteredBachelors', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }

    const users = await getFilteredBachelors(id, req.body);
    res.send(users);

  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

router.post('/sendSignupEmail', async (req, res) => {
  try {
    const { email } = req.body.email;

    await resendSignupEmail(email);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//   axios.put(`http://localhost:3001/user/setAsProfilePic/${file.id}`, {}
router.put('/setAsProfilePic/:fileId', async (req, res) => {
  try {
    //
    console.log(req.params.fileId);
    const files = await updateProfilePicture(req.params.fileId, req.body.userId);
    console.log(files);
    res.send(files);
  } catch (err) {
    if (typeof (err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Get liked users
router.get('/:id/liked', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }

    const likedUsers = await getLikedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Get matched users
router.get('/:id/matched', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    const likedUsers = await getMatchedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Get blocked users
router.get('/:id/blocked', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    const likedUsers = await getBlockedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});


function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getLogin(email, password);
    const accessToken = generateAccessToken(user);
    res.send(accessToken);
  } catch (err) {
    if (err.message === 'Invalid email or password')
      res.status(401).send(err.message);
    else if (err.message === 'Email not verified')
      res.status(403).send(err.message);
    else
      res.status(500).send(err.message);
    }
  }
);

router.post('/fake', async (req, res) => {
  try {
    const fakeUser = req.body.fakeUserName;
    const position = req.body.position;
    console.log(fakeUser);
    console.log(position);
    const user = await CreateFakeUser(fakeUser, position.longitude, position.latitude);
    console.log(user);
    const accessToken = generateAccessToken(user);
    res.send(accessToken);
  } catch (err) {
    if (err.message === 'Invalid email or password.') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});


// Get a user by their ID
router.get('/:id', async (req, res) => {
  try {
    if (req.params.id === null) {
      throw 'get /users/:id id undefined'
    }
    if (isNaN(req.params.id)) {
      console.log("here");
        throw '400: id must be a number';
    }
    console.log('get a user by id');
    const user = await getUserById(req.params.id);


    res.send(user);
  } catch (err) {
    console.log(err)
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Get a user by their ID w/o email and password
router.get('/:id/profile/:visit_id', async (req, res) => {
  try {
    if (req.params.id === null || req.params.visit_id === null) {
      throw 'get /users/:id/profile id undefined'
    }
    if (isNaN(req.params.id) || isNaN(req.params.visit_id)) {
      throw new BadRequestError('id must be a number');
    }

    const active = await isActive(req.params.id);
    if (active === false) {
      throw new ForbiddenError('Please activate your account by uploading a photo');
    }
    const blocked = await isBlocked(req.params.id, req.params.visit_id);
    if (blocked) {
      throw new ForbiddenError('You are blocked');
    }

    const user = await getUserByIdProfile(req.params.visit_id);
    if (user.active === false)
      throw new NotFoundError('this user is inactive');
    res.send(user);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// Insert a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, longitude, latitude } = req.body;
    const user = await insertUser(firstName.trim(), lastName.trim(), email.trim(), password, longitude, latitude);
    res.send(user);
  } catch (err) {
    if (err.message === 'A user with the given email already exists')
      res.status(403).send(err.message);
    else if (err.message === "Email format is invalid")
      res.status(400).send(err.message);
    else
      res.status(500).send(err);
  }
});


function changeUserData(user, update) {
  if (update.first_name) {
    user.first_name = update.first_name;
  }
  if (update.last_name) {
    user.last_name = update.last_name;
  }
  if (update.email && user.email != update.email) {
    user.email = update.email;
    user.active = false;
  }
  if (update.age) {
    user.age = update.age;
  }
  if (update.sex) {
    user.sex = update.sex;
  }
  if (update.sex_orientation) {
    user.sex_orientation = update.sex_orientation;
  }
  if (update.city) {
    user.city = update.city;
  }
  if (update.country) {
    user.country = update.country;
  }
  if (update.interests) {
    user.interests = update.interests;
  }
  if (update.bio) {
    user.bio = update.bio;
  }
  if (update.report_count) {
    user.report_count += 1;
  }
  return user
}

// Update user
router.put('/:id/update', async (req, res) => {
  try {
    const id = req.params.id;
    log.info("[userController]", "update user:", id);
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    var user = await getUserById(id);

    console.log(user);
    user = changeUserData(user, req.body);
    console.log(user);
    log.info("[userController]", user);
    const newUser = await updateUser(user);

    res.send(newUser);
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
    } else if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message);
    }
      res.status(500).send(err.message);
  }
});

// Update user
router.put('/resetpassword', async (req, res) => {
  try {
    log.info('[userController]', 'resetpassword');
    log.info('[userController]', req.body);
    const {currentPassword, newPassword, id} = req.body;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    const user = await getUserById(id);

    console.log('lol')
    await resetPassword(currentPassword, newPassword, user);

   res.sendStatus(200);
  } catch (err) {
    if (err.message === 'A user with the given email already exists.' || err.message === 'Invalid email or password .') {
      res.status(403).send(err.message);
      return;
    } else if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message);
      return;
    } 
    res.status(500).send(err.message);
  }
});

// Delete a user by their ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
        throw '400: id must be a number';
    }
    await deleteUser(id);
    res.send({ id });
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message);
      return;
    }
    res.status(500).send(err.message);
  }
});

export default router