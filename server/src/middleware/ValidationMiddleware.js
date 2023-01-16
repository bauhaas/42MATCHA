import { BadRequestError, sendErrorResponse } from '../errors/error.js'

export const validateParamId = (req, res, next) => {
  try {
    if (isNaN(req.params.id))
      throw new BadRequestError('id must be a number');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateParamIds = (req, res, next) => {
  try {
    if (isNaN(req.params.id1) || isNaN(req.params.id2))
      throw new BadRequestError('ids must be numbers');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateBodyMultipleId = (req, res, next) => {
  try {
    const {userId1, userId2 } = req.body;
    if (isNaN(userId1) || isNaN(userId2))
      throw new BadRequestError('id must be a number');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validatePostNotif = (req, res, next) => {
  try {
    const { sender_id, receiver_id, type } = req.body;
    if (typeof sender_id === 'undefined' || typeof receiver_id === 'undefined' || typeof type === 'undefined')
      throw new BadRequestError('undefined variable');
    if (isNaN(sender_id) || isNaN(receiver_id))
      throw new BadRequestError('ids must be numbers')
    if (["like", "unlike", "match", "visit"].includes(type) === false)
      throw new BadRequestError('wrong notification type');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateRelationBody = (req, res, next) => {
  try {
    const { sender_id, receiver_id, type } = req.body;
    if (typeof sender_id === 'undefined' || typeof receiver_id === 'undefined' || typeof type === 'undefined')
      throw new BadRequestError('undefined variable');
    if (isNaN(sender_id) || isNaN(receiver_id))
      throw new BadRequestError('ids must be numbers')

    const validTypes = ["block", "like", "unlike", "match"];
    if (validTypes.includes(type) === false)
      throw new BadRequestError('relation type is invalid')
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateUserCreationBody = (req, res, next) => {
  try {
    const { firstName, lastName, email, password, longitude, latitude } = req.body;
    if (typeof firstName === 'undefined' || typeof lastName === 'undefined' || typeof email === 'undefined'
      || typeof password === 'undefined' || typeof longitude === 'undefined' || typeof latitude === 'undefined')
      throw new BadRequestError('undefined variable');

    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validatePinBody = (req, res, next) => {
  try {
    const {newPassword, pin, id} = req.body;
    if (typeof newPassword === 'undefined' || typeof pin === 'undefined' || typeof id === 'undefined')
      throw new BadRequestError('undefined variable');
    if (isNaN(pin) || isNaN(id))
      throw new BadRequestError('pin and id must be numbers')

    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};