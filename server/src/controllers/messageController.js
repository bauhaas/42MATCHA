import express from 'express';
import jwt from 'jsonwebtoken';
import log from '../config/log.js';
import { deleteConversation, getMessageHistory, patchMessages } from '../services/messageService.js';

const router = express.Router();

// Get the message history for a conversation
router.get('/history/:conversationId', async (req, res) => {
  try {
    console.log('lol');
    const conversationId = req.params.conversationId;
    log.info('[messageController]', 'enter in getHistory');
    const messages = await getMessageHistory(conversationId);
    res.send(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Patch conv of a user
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[messageController]', 'enter in patchMessages of conv:', id);
        const messages = await patchMessages(id);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
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
