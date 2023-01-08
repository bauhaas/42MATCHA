import log from '../config/log.js';
import express from 'express';
import { getConversationsOf, getConversationBetween } from '../services/conversationService.js';
import { validateParamId } from '../middleware/idValidationMiddleware.js';
import { sendErrorResponse } from '../errors/error.js';
const router = express.Router();

router.get('/user/:id', validateParamId, async (req, res) => {
    try {
        const conversations = await getConversationsOf(req.params.id);
        res.status(200).send(conversations);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

router.get('/:id1/:id2', async (req, res) => {
    try {
        const conversation = await getConversationBetween(req.params.id1, req.params.id2);
        res.status(200).send(conversation);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

export default router