import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { handleForgottenPassword, validateNewPassword, resendSignupEmail, updateProfilePicture, deleteFile, getUserFiles, isActive, saveFile, getFilteredBachelors, getAllUsers, getUserById, insertUser, updateUser, deleteUser, getLogin, CreateFakeUser, resetPassword, getLikedUsers, getMatchedUsers, getUserByIdProfile, getBachelors, getBlockedUsers } from '../services/userService.js';
import { authenticateToken } from '../middleware/authMiddleware.js'
import { validateParamId, validateParamIds, validateUserCreationBody, validatePinBody } from '../middleware/ValidationMiddleware.js'
import { isBlocked } from '../services/relationsService.js';
import log from '../config/log.js';
import fs from 'fs';
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

router.post('/:id/upload', validateParamId, async (req, res, next) => {
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


router.get('/files/:id', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    const files = await getUserFiles(id);
    res.send(files);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.delete('/files/:id1/:id2', authenticateToken, validateParamIds, async (req, res) => {
  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    await deleteFile(id1, id2);
    res.send({ message: 'File deleted successfully' });
  } catch (err) {
    sendErrorResponse(res, err);
  }
});


// Get all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});



router.get('/:id/bachelors/', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    const users = await getBachelors(id);
    res.send(users);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.post('/:id/filteredBachelors', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    const users = await getFilteredBachelors(id, req.body);
    res.send(users);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.post('/sendSignupEmail', async (req, res) => {
  try {
    const { email } = req.body;
    await resendSignupEmail(email);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.put('/setAsProfilePic/:fileId', async (req, res) => {
  try {
    console.log(req.params.fileId);
    const files = await updateProfilePicture(req.params.fileId, req.body.userId);
    res.send(files);
  } catch (err) {
   sendErrorResponse(res, err);
  }
});

// Get liked users
router.get('/:id/liked', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    const likedUsers = await getLikedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// Get matched users
router.get('/:id/matched', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    const likedUsers = await getMatchedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// Get blocked users
router.get('/:id/blocked', authenticateToken, validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    const blockedUsers = await getBlockedUsers(id);
    res.send(blockedUsers);
  } catch (err) {
    sendErrorResponse(res, err);
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
    sendErrorResponse(res, err);
  }
});

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
    sendErrorResponse(res, err);
  }
});


// Get a user by their ID
router.get('/:id', authenticateToken, validateParamId, async (req, res) => {
  try {
    if (req.params.id === null) {
      throw new BadRequestError('id must be defined')
    }
    if (isNaN(req.params.id)) {
      throw new BadRequestError('id must be a number')
    }
    console.log('get a user by id');
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    sendErrorResponse(res , err);
  }
});

// Get a user by their ID w/o email and password
router.get('/:id/profile/:visit_id', authenticateToken, async (req, res) => {
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
router.post('/', validateUserCreationBody, async (req, res) => {
  try {
    const { firstName, lastName, email, password, longitude, latitude } = req.body;
    const user = await insertUser(firstName.trim(), lastName.trim(), email.trim(), password, longitude, latitude);
    res.send(user);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});


function changeUserData(user, update) {
  if (update.first_name) {
    user.first_name = update.first_name;
  }
  if (update.last_name) {
    user.last_name = update.last_name;
  }
  if (update.email) {
    user.email = update.email;
  }
  if (isNaN(update.age))
    throw new BadRequestError('age must be a number');
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
  if (typeof update.active !== 'undefined') {
    user.active = update.active;
  }
  return user
}

// Update user
router.put('/:id/update', validateParamId, async (req, res) => {
  try {
    const id = req.params.id;
    log.info("[userController]", "update user:", id);
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    var user = await getUserById(id);

    console.log(user);
    user = changeUserData(user, req.body);
    console.log(user);
    log.info("[userController]", user);
    const newUser = await updateUser(user);

    res.send(newUser);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// Reset password
router.post('/resetPassword', async (req, res) => {
  try {
    log.info('[userController]', 'resetpassword');
    log.info('[userController]', req.body);
    const {email} = req.body;

    await handleForgottenPassword(email);
    res.sendStatus(200);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// Send pin via mail
router.put('/sendPin', authenticateToken, async (req, res) => {
  try {
    log.info('[userController]', 'resetpassword');
    log.info('[userController]', req.body);
    const {currentPassword, id} = req.body;
    if (isNaN(id))
        throw new BadRequestError('id must be a number');
    const user = await getUserById(id);

    const result = await resetPassword(currentPassword, user);
    console.log(result)
    res.sendStatus(200);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

// verif pin and set new password
router.put('/pin', authenticateToken, validatePinBody, async (req, res) => {
  try {
    log.info('[userController]', 'pin');
    log.info('[userController]', req.body);
    const {newPassword, pin, id} = req.body;
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    if (isNaN(pin))
        throw new BadRequestError('pin must be a number')
    const user = await getUserById(id);

    await validateNewPassword(newPassword, pin, user);
    res.send(200);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

export default router;
