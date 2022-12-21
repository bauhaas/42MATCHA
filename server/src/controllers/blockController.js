import express from 'express';
import { insertBlock, getBlocksOfUser, deleteBlock, getBlockedUsersByBlockerId } from '../services/blockService.js';
import jwt from 'jsonwebtoken';
import log from '../config/log.js';

const router = express.Router();

// Get all blocks of blocker_id
router.get('/:blocker_id', async (req, res) => {
  try {
    const blocker_id = req.params.blocker_id;
    const blocks = await getBlocksOfUser(blocker_id);
    res.send(blocks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all GET_BLOCKED_USERS_BY_BLOCKER_ID
router.get('/:blocker_id/users', async (req, res) => {
  try {
    log.info('[blockController]', 'get all blocked user by blocker_id');
    const blocker_id = req.params.blocker_id;
    const blocks = await getBlockedUsersByBlockerId(blocker_id);
    res.send(blocks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new block
router.post('/', async (req, res) => {
  try {
    const { blocker_id, blocked_id } = req.body;
    const block = await insertBlock(blocker_id, blocked_id);

    res.send(block);
  } catch (err) {
    if (err.message === 'Invalid email or password.') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});


// Delete a block
router.delete('/', async (req, res) => {
  try {
    console.log(req.body);
    log.info('[blockController]', 'delete block');
    const { blocker_id, blocked_id } = req.body;
    await deleteBlock(blocker_id, blocked_id);

    res.send({blocker_id});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router
