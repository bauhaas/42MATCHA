import log from '../config/log.js';
import express from 'express';
import { deleteConversation, createConversation, getConversationsOf } from '../services/conversationService.js';

const router = express.Router();

const validateUserId =(id) => {
    if (isNaN(id))
        throw new Error('userId must be a number');
}

router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        validateUserId(id);
        const conversations = await getConversationsOf(id);
        res.status(200).send(conversations);
    } catch (err) {
        if (err.message === 'userId must be a number')
            res.status(400).send(err.message)
        else
            res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id))
            throw new Error('conversation id must be a number');
        await deleteConversation(id);
        res.sendStatus(204);
    } catch (err) {
        if (err.message === 'conversation id must be a number')
            res.status(400).send(err.message)
        else
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        validateUserId(userId1);
        validateUserId(userId2);
        const conversation = await createConversation(userId1, userId2);
        console.log(conversation);
        res.status(201).send(conversation);
    } catch (err) {
        if (err.message === 'userId must be a number')
            res.status(400).send(err.message)
        else
        res.status(500).send(err.message);
    }
});

export default router