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
        const { userId1, userId2 } = req.body;
        log.info('[conversationController]', 'enter in insertConv');
        const id = await insertConversation(userId1, userId2);
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


// // Patch conv of a user
// router.patch('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { unread } = req.body;
//         log.info('[conversationController]', 'enter in patchConv', id, unread);
//         const conversation = await patchConversation(id, unread);
//         log.info('[conversationController]', conversation);
//         res.sendStatus(200);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

export default router