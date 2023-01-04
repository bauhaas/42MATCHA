import express from 'express';
import jwt from 'jsonwebtoken';

import { isActive, getFilteredBachelors, getAllUsers, getUserById, insertUser, updateUser, deleteUser, getLogin, CreateFakeUser, resetPassword, getLikedUsers, getMatchedUsers, getUserByIdProfile, getBachelors, getBlockedUsers } from '../services/userService.js';
import { authenticateToken } from '../middleware/authMiddleware.js'
import { isBlocked } from '../services/relationsService.js';
import log from '../config/log.js';
import fs from 'fs';

const router = express.Router();

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
    users.forEach((user) => {
      if (user.photos === 0) {
        return ;
      }
      var files = fs.readdirSync('./pictures/').filter(file => file.startsWith('user_' + user.id + "_"));
      user.photos_path = files;
    });
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
    users.forEach((user) => {
      if (user.photos === 0) {
        return ;
      }
      var files = fs.readdirSync('./pictures/').filter(file => file.startsWith('user_' + user.id + "_"));
      user.photos_path = files;
    });
    res.send(users);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
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
    if (err.message === 'Invalid email or password.') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
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
    if (user.photos === 0) {
      return user;
    }
    user.photos_path = [];
    var files = fs.readdirSync('./pictures/').filter(file => file.startsWith('user_' + user.id + "_"));
    user.photos_path = files;

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
      throw new Error('id must be a number');
    }

    const active = await isActive(req.params.id);
    if (active === false) {
      throw new Error('Please activate your account by uploading a photo');
    }
    const blocked = await isBlocked(req.params.id, req.params.visit_id);
    if (blocked) {
      throw new Error('You are blocked')
    }

    const user = await getUserByIdProfile(req.params.visit_id);
    if (user.active === false) {
      throw new Error('this user is inactive');
    }
    if (user.photos === 0) {
      return user;
    }
    user.photos_path = [];
    var files = fs.readdirSync('./pictures/').filter(file => file.startsWith('user_' + user.id + "_"));
    user.photos_path = files;

    res.send(user);
  } catch (err) {
    console.log(err);
    console.log(err.message);
    if (err.message === 'You are blocked') {
      res.status(404).send(err.message);
      return;
    } else if (typeof(err) === "string" && err.includes('number')) {
      res.status(400).send(err.message)
      return;
    } else if (err.message.includes('activ')) {
      res.status(403).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Insert a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, longitude, latitude } = req.body;
    const user = await insertUser(firstName.trim(), lastName.trim(), email.trim(), password, longitude, latitude);
    res.send(user);
  } catch (err) {
    console.log(err)
    console.log(err.message)
    console.log(err.message === "invalid email")
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
      return;
    } else if (err.message === "invalid email") {
      res.send(err);
      return;
    }
    res.status(500).send(err);
  }
});


function changeUserData(user, update) {
  if (update.first_name) {
    user.first_name = update.first_name.trim();
  }
  if (update.last_name) {
    user.last_name = update.last_name.trim();
  }
  if (update.email) {
    user.email = update.email.trim();
  }
  if (update.age) {
    user.age = update.age;
  }
  if (update.sex) {
    user.sex = update.sex.trim();
  }
  if (update.sex_orientation) {
    user.sex_orientation = update.sex_orientation.trim();
  }
  if (update.city) {
    user.city = update.city.trim();
  }
  if (update.country) {
    user.country = update.country;
  }
  if (update.interests) {
    //TODO foire à cause du format json
    user.interests = update.interests;
  }
  if (update.bio) {
    user.bio = update.bio;
  }
  if (update.report_count) {
    user.report_count += 1;
  }
  if (update.photos_path) {
    // del previous photos
    if (user.photos > 0) {
      var files = fs.readdirSync('./pictures/').filter(file => file.startsWith('user_' + user.id + "_"));
      files.forEach((file) => {
        fs.unlinkSync(file);
      });
    }

    // path and files are verificated and secured
    user.photos = 0;
    console.log(update.photos_path)
    update.photos_path.forEach((path) => {
      user.photos += 1;
      fs.copyFile(path, './pictures/user_' + user.id + "_image_" + user.photos + path.split('.').pop(), (err) => {
        if (err) throw err;
        console.log(parg + ' was copied to destination.txt');
      });
    });
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

    user = changeUserData(user, req.body);

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

    await resetPassword(currentPassword, newPassword, user);

   res.sendStatus(200);
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
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