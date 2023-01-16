import jwt from 'jsonwebtoken';
import { sendErrorResponse, UnauthorizedError } from '../errors/error.js';

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            throw new UnauthorizedError('You need to be authenticated to get access to this ressource')
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                throw new UnauthorizedError('You need to be authenticated to get access to this ressource')
            }
            req.user = user;
            next();
        });
    } catch (err) {
        sendErrorResponse(res, err);
    }

}