import log from '../config/log.js';
import express from 'express';
import { deleteConversation, insertConversation, getConversations } from '../services/conversationService.js';

const router = express.Router();

// Delete a conv by it's id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            throw '400: id must be a number';
        }
        log.info('[conversationController]', 'enter in deleteConv');
        await deleteConversation(id);
        res.send({id});
    } catch (err) {
        if (typeof(err) === "string" && err.includes('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

// Insert a new conv
router.post('/', async (req, res) => {
    try {
        log.info('[conversationController]', 'body: ', req.body);
        const { userId1, userId2 } = req.body;
        if (isNaN(userId1) || isNaN(userId2)) {
            throw '400: Nan found';
        }
        log.info('[conversationController]', 'enter in insertConv');
        const conversation = await insertConversation(userId1, userId2);
        res.send(conversation);
    } catch (err) {
        if (typeof(err) === "string" && err.includes('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

// Get convs of a user
router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        if (isNaN(id)) {
            throw '400: userId must be a number';
        }
        log.info('[conversationController]', 'enter in getConv');
        const conversations = await getConversations(id);
        log.info('[conversationController]', conversations);
        res.send(conversations);
    } catch (err) {
        if (typeof(err) === "string" && err.includes('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

export default router
