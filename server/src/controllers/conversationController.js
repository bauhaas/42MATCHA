import log from '../config/log.js';
import express from 'express';
import { deleteConversation, createConversation, getConversationsOf } from '../services/conversationService.js';
import { validateBodyMultipleId, validateParamId } from '../middleware/idValidationMiddleware.js';

const router = express.Router();

router.get('/user/:id', validateParamId, async (req, res) => {
    try {
        const conversations = await getConversationsOf(req.params.id);
        res.status(200).send(conversations);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

router.post('/', validateBodyMultipleId, async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        const conversation = await createConversation(userId1, userId2);
        res.status(201).send(conversation);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

//TODO to delete, it's unused, we delete conv on the unmatch via relation service
// router.delete('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         if (isNaN(id))
//             throw new Error('conversation id must be a number');
//         await deleteConversation(id);
//         res.sendStatus(204);
//     } catch (err) {
//         if (err.message === 'conversation id must be a number')
//             res.status(400).send(err.message)
//         else
//         res.status(500).send(err.message);
//     }
// });



export default router