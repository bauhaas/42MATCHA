import express from 'express';
import { getAllRelations, insertRelation, deleteRelationByContent } from '../services/relationsService.js';
import log from '../config/log.js';
import { BadRequestError, sendErrorResponse } from '../errors/error.js';
import { validateRelationBody } from '../middleware/ValidationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, validateRelationBody, async (req, res) => {
  try {
    const { sender_id, receiver_id, type } = req.body;
    if (isNaN(sender_id) || isNaN(receiver_id))
        throw new BadRequestError('id must be a number');

    const newRelation = await insertRelation(sender_id, receiver_id, type.trim());
    res.send(newRelation);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const relations = await getAllRelations();
    res.status(200).send(relations);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.delete('/', authenticateToken, async (req, res) => {
  try {

    const { sender_id, receiver_id, type } = req.body;
    await deleteRelationByContent(sender_id, receiver_id, type.trim());
    res.sendStatus(204);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

export default router