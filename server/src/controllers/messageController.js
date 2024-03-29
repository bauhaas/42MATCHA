import express from 'express';
import log from '../config/log.js';
import {getMessageHistory, setMessagesAsRead } from '../services/messageService.js';
import { validateParamId} from '../middleware/ValidationMiddleware.js'
import { sendErrorResponse } from '../errors/error.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get the message history for a conversation
router.get('/history/:id', authenticateToken, validateParamId, async (req, res) => {
  try {
    const messageHistory = await getMessageHistory(req.params.id);
    res.status(200).send(messageHistory);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.patch('/:id', authenticateToken, validateParamId, async (req, res) => {
  try {
      await setMessagesAsRead(req.params.id);
      res.sendStatus(204);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

export default router