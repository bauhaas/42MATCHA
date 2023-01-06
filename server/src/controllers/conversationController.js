import log from '../config/log.js';
import express from 'express';
import { deleteConversation, insertConversation, getConversations } from '../services/conversationService.js';

const router = express.Router();


const validateUserId =(id) => {
    if (isNaN(id))
        throw new Error('userId must be a number');
}

// Delete a conv by it's id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id))
            throw new Error('conversation id must be a number');
        log.info('[conversationController]', 'enter in deleteConv');
        await deleteConversation(id);
        res.send({id}); //TODO maybe just send a 200
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
        log.info('[conversationController]', 'enter in insertConv');
        const conversation = await insertConversation(userId1, userId2);
        res.send(conversation);
    } catch (err) {
        if (err.message === 'userId must be a number')
            res.status(400).send(err.message)
        else
        res.status(500).send(err.message);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        validateUserId(id);
        const conversations = await getConversations(id);
        res.send(conversations);
    } catch (err) {
        if (err.message === 'userId must be a number')
            res.status(400).send(err.message)
        else
            res.status(500).send(err.message);
    }
});

export default router
