import express from 'express';
import { getAllUsers, getUserById, insertUser, updateUser, deleteUser, getLogin } from '../services/userService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    console.log('get all users')
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


function generateAccessToken(user) {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}


// TODO move to auth folder - allow to logn and check to the db the passs and email
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getLogin(email, password);
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('req', req);
  console.log('authHeader', authHeader);
  console.log('token', token);
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    req.user = user;
    next();
  });
}

// Get a user by their ID
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    console.log('get user by id');
    console.log(req);
    const id = req.params.id;
    const user = await getUserById(id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(email, password);
    const id = await insertUser(firstName, lastName, email, password);
    res.send({ id });
  } catch (err) {
    if (err.message === 'A user with the given email already exists.') {
      res.status(403).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});

// Update a user's information
router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { name, age } = req.body;
      await updateUser(name, age, id);
      res.send({ id });
    } catch (err) {
      res.status(500).send(err.message);
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