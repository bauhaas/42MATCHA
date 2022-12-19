import express from 'express';
import jwt from 'jsonwebtoken';
import log from '../config/log.js';
import { deleteConversation, getMessagesOfConversation, insertMessage } from '../services/messageService.js';

const router = express.Router();

// Get all messages between sender_id and receiver_id
router.get('/:sender_id/:receiver_id', async (req, res) => {
  try {
    const sender_id = req.params.sender_id;
    const receiver_id = req.params.receiver_id;
    const messages = await getMessagesOfConversation(sender_id, receiver_id);
    res.send(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new message
router.post('/', async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const messageCreated = await insertMessage(sender_id, receiver_id, message);

    res.send(messageCreated);
  } catch (err) {
    if (err.message === 'Invalid email or password.') {
      res.status(401).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
});


// Delete a conversation
router.delete('/', async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;
    await deleteConversation(sender_id, receiver_id);

    res.send(sender_id);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router
