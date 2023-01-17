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

    if (firstName.length > 100 || lastName.length > 100 || email.length > 100 || password.length > 100)
      throw new BadRequestError('var too long');

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
    if (newPassword.length > 100)
      throw new BadRequestError('new password too long');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateUpdateArgs = (req, res, next) => {
  try {
    const {first_name, last_name, email, sex, sex_orientation, interests, bio, age} = req.body;

    if (isNaN(req.params.id))
      throw new BadRequestError('id must be a number');
    if (isNaN(id))
      throw new BadRequestError('pin and id must be numbers')
    if (typeof first_name === 'undefined' || typeof last_name === 'undefined' || typeof email === 'undefined'
      || typeof sex === 'undefined' || typeof sex_orientation === 'undefined' || typeof interests === 'undefined'
      || typeof bio === 'undefined' || typeof age === 'undefined')
      throw new BadRequestError('undefined variable');
    if (first_name.length > 100 || last_name.length > 100 || email.length > 100 || sex.length > 100
      || sex_orientation.length > 100)
      throw new BadRequestError('variable too long');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateSendPin = (req, res, next) => {
  try {
    const {currentPassword, id} = req.body;

    if (typeof currentPassword === 'undefined' || typeof id === 'undefined')
      throw new BadRequestError('undefined variable');
    if (isNaN(id))
      throw new BadRequestError('id must be a number');
    if (email.length > 100)
      throw new BadRequestError('email too long');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    const {email, password} = req.body;

    if (typeof email === 'undefined' || typeof password === 'undefined')
      throw new BadRequestError('undefined variable');
    if (email.length > 100 || password.length > 100)
      throw new BadRequestError('variable too long');
    next();
  } catch (err) {
    sendErrorResponse(res, err);
  }
};