import express from 'express';
import { getAllRelations, insertRelation, deleteRelationByContent } from '../services/relationsService.js';
import log from '../config/log.js';
import { BadRequestError, sendErrorResponse } from '../errors/error.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    log.info('[relationsController]', 'post relation');
    const { sender_id, receiver_id, type } = req.body;
    if (isNaN(sender_id) || isNaN(receiver_id))
        throw new BadRequestError('id must be a number');

    const newRelation = await insertRelation(sender_id, receiver_id, type.trim());
    console.log('newRelation',newRelation);
    res.send(newRelation);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.get('/', async (req, res) => {
  try {
    log.info('[relationsController]', 'get all relations');
    const relations = await getAllRelations();
    res.status(200).send(relations);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

router.delete('/', async (req, res) => {
  try {
    log.info('[relationsController]', 'delete relation', req.body);

    const { sender_id, receiver_id, type } = req.body;
    if (isNaN(sender_id) || isNaN(receiver_id))
      throw new BadRequestError('id mst be a number')

    const validTypes = ["block", "like", "match"];
    if (validTypes.includes("type"))
      throw new BadRequestError('relation type is invalid')

    await deleteRelationByContent(sender_id, receiver_id, type.trim());
    res.sendStatus(204);
  } catch (err) {
    sendErrorResponse(res, err);
  }
});

export default router