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