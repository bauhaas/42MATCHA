import express from 'express';
import { getAllRelations, getRelationsBySenderId, insertRelation, getBlockedUsersBySenderId, getLikedUsersBySenderId, getMatchedUsersBySenderId, deleteRelationByContent } from '../services/relationsService.js';
import jwt from 'jsonwebtoken';
import log from '../config/log.js';

const router = express.Router();

// get blocked users by sender_id
router.get('/', async (req, res) => {
  try {
    log.info('[relationsController]', 'get all relations');
    const blocks = await getAllRelations();
    res.send(blocks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get relations by sender_id
router.get('/:sender_id', async (req, res) => {
  try {
    log.info('[relationsController]', 'get all relations by sender_id');
    const sender_id = req.params.sender_id;
    const blocks = await getRelationsBySenderId(sender_id);
    res.send(blocks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get blocked users by sender_id
router.get('/:sender_id/blocked', async (req, res) => {
  try {
    log.info('[relationsController]', 'get all blocked user by sender_id');
    const sender_id = req.params.sender_id;
    const blocks = await getBlockedUsersBySenderId(sender_id);
    res.send(blocks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get liked users by sender_id
router.get('/:sender_id/liked', async (req, res) => {
    try {
      log.info('[relationsController]', 'get all liked user by sender_id');
      const sender_id = req.params.sender_id;
      const likes = await getLikedUsersBySenderId(sender_id);
      res.send(likes);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// get matched users by sender_id
router.get('/:sender_id/matched', async (req, res) => {
    try {
    log.info('[relationsController]', 'get all matched user by sender_id');
    const sender_id = req.params.sender_id;
    const matches = await getMatchedUsersBySenderId(sender_id);
    res.send(matches);
    } catch (err) {
    res.status(500).send(err.message);
    }
});


// Create new relations
router.post('/', async (req, res) => {
  try {
    const { sender_id, receiver_id, type } = req.body;
    const newRelation = await insertRelation(sender_id, receiver_id, type);

    res.send(newRelation);
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
    log.info('[relationsController]', 'delete relation');
    const { sender_id, receiver_id, type } = req.body;
    await deleteRelationByContent(sender_id, receiver_id, type);

    res.send({sender_id});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router
