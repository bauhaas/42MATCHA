import express from 'express';
import { isBlocked, getAllRelations, getRelationsBySenderId, insertRelation, deleteRelationByContent, getRelationTypeOfUsers } from '../services/relationsService.js';
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
    if (isNaN(sender_id)) {
        throw '400: sender_id must be a number';
    }
    const blocks = await getRelationsBySenderId(sender_id);
    res.send(blocks);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// get relation type between users
router.get('/type/:sender_id/:receiver_id', async (req, res) => {
  try {
    const sender_id = req.params.sender_id
    const receiver_id = req.params.receiver_id;
    if (isNaN(sender_id) || isNaN(receiver_id)) {
        throw '400: sender_id must be a number';
    }
    log.info('[relationsController]', 'get relation type between users');
    const type = await getRelationTypeOfUsers(sender_id, receiver_id);
    res.send(type);
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

// Create new relations
router.post('/', async (req, res) => {
  try {
    const { sender_id, receiver_id, type } = req.body;
    if (isNaN(sender_id) || isNaN(receiver_id)) {
        throw '400: sender_id and receiver_id must be a number';
    }

    const blocked = await isBlocked(receiver_id, sender_id);
    if (blocked) {
      throw 'You are blocked';
    }

    const newRelation = await insertRelation(sender_id, receiver_id, type.trim());

    res.send(newRelation);
  } catch (err) {
    if (err.message === 'You are blocked') {
      res.status(404).send(err.message);
    } else if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});


// Delete a relation
router.delete('/', async (req, res) => {
  try {
    console.log(req.body, req.params);
    log.info('[relationsController]', 'delete relation', req.body);

    const { sender_id, receiver_id, type } = req.body;
    if (isNaN(sender_id) || isNaN(receiver_id)) {
        throw '400: sender_id and receiver_id must be a number';
    }
    const validTypes = ["block", "like", "unlike", "match"];
    if (validTypes.includes("type")) {
      throw '400: wrong type' + type;
    }
    log.info('[relationsController]', 'enter in deleteRelationByContent');
    await deleteRelationByContent(sender_id, receiver_id, type.trim());

    res.send({sender_id});
  } catch (err) {
    if (typeof(err) === "string" && err.includes('400')) {
      res.status(400).send(err.message)
      return;
    }
    res.status(500).send(err.message);
  }
});

export default router
