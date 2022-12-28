import log from '../config/log.js';
import express from 'express';
import { deleteConversation, insertConversation, getConversations } from '../services/conversationService.js';

const router = express.Router();

// Delete a conv by it's id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[conversationController]', 'enter in deleteConv');
        await deleteConversation(id);
        res.send({id});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insert a new conv
router.post('/', async (req, res) => {
    try {
        log.info('[conversationController]', 'body: ', req.body);
        const { sender_id, receiver_id } = req.body;
        log.info('[conversationController]', 'enter in insertConv');
        const id = await insertConversation(sender_id, receiver_id);
        res.send({ id });
    } catch (err) {
            res.status(500).send(err.message);
    }
});

// Get convs of a user
router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        log.info('[conversationController]', 'enter in getConv');
        const conversations = await getConversations(id);
        log.info('[conversationController]', conversations);
        res.send(conversations);
    } catch (err) {
            res.status(500).send(err.message);
    }
});

export default router