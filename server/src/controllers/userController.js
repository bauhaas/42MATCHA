import express from 'express';
import { getAllUsers, getUserById, insertUser, deleteUser, getLogin } from '../services/userService.js';
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
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
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