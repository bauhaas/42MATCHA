import express from 'express';
import { getAllUsers, getUserById, insertUser, updateUser, deleteUser, getLogin, CreateFakeUser, resetPassword, getLikedUsers, getMatchedUsers, getUserByIdProfile, getBachelors } from '../services/userService.js';
import jwt from 'jsonwebtoken';
import log from '../config/log.js';

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


// Get all users
router.get('/:id/bachelors/:page', async (req, res) => {
  try {
    const id = req.params.id;
    const page = req.params.page;
    const users = await getBachelors(id, page);
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get liked users
router.get('/:id/liked', async (req, res) => {
  try {
    const id = req.params.id;
    const likedUsers = await getLikedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get matched users
router.get('/:id/matched', async (req, res) => {
  try {
    const id = req.params.id;
    const likedUsers = await getMatchedUsers(id);
    res.send(likedUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

//TODO
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}


// TODO maybe create an auth controller/sevice ?
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


// TODO maybe create an auth controller/sevice ?
router.post('/fake', async (req, res) => {
  try {
    const fakeUser = req.body.fakeUserName;
    const position = req.body.position;
    console.log(fakeUser);
    console.log(position);
    const user = await CreateFakeUser(fakeUser, position);
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


//TODO move to middleware file
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null)
    return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    req.user = user;
    next();
  });
}

// Get a user by their ID
router.get('/:id', async (req, res) => {
  try {
    if (req.params.id === null) {
      throw 'get /users/:id id undefined'
    }
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a user by their ID w/o pemail and passwor
router.get('/:id/profile', async (req, res) => {
  try {
    if (req.params.id === null) {
      throw 'get /users/:id/profile id undefined'
    }
    const user = await getUserByIdProfile(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, position } = req.body;
    const id = await insertUser(firstName, lastName, email, password, position);
    res.send({ id });
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
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
  if (update.active) {
    user.active = update.active;
  }
  if (update.last_location) {
    user.last_location = update.last_location;
  }
  if (update.fame_rating) {
    user.fame_rating = update.fame_rating;
  }
  if (update.report_count) {
    user.report_count += 1;
  }

  return user
}

// Update user
router.put('/:id/update', authenticateToken, async (req, res) => {
  try {
    log.info("id", req.params.id);
    var user = await getUserById(req.params.id);

    log.info(req.body);
    user = changeUserData(user, req.body);

    log.info(user);
    const newUser = await updateUser(user);

    res.send(newUser);
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});


// Update user
router.put('/resetpassword', async (req, res) => {
  try {
    log.info('[userController]', 'resetpassword');
    log.info('[userController]', req.body);
    const {currentPassword, newPassword, id} = req.body;
    const user = await getUserById(id);

    await resetPassword(currentPassword, newPassword, user);

   res.sendStatus(200);
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});


// Delete a user by their ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deleteUser(id);
    res.send({ id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router