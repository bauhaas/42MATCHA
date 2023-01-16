import jwt from 'jsonwebtoken';
import express from 'express';
import { getNotificationsOfUserId, getAllNotifications, getReceivedNotifications, deleteNotification, insertNotification, setNotificationAsRead } from '../services/notificationsService.js';
import { isBlocked } from '../services/relationsService.js';
import log from '../config/log.js';
import { sendErrorResponse, ForbiddenError } from '../errors/error.js';
import { validateParamId, validatePostNotif} from '../middleware/ValidationMiddleware.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifs
router.get('/', authenticateToken, async (req, res) => {
    try {
        const notifications = await getAllNotifications();
        res.send(notifications);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

// Get notifs where user is receiver //TODO seems useless. I should only need to get the notif where user is receiver; here it returns either receiver or sender
router.get('/:id', authenticateToken, validateParamId, async (req, res) => {
    try {
        const notifications = await getNotificationsOfUserId(req.params.id);
        res.status(200).send(notifications);
    } catch (err) {
       sendErrorResponse(res, err);
    }
});

// Get notifs where user is receiver
router.get('/:id/receiver', authenticateToken,  validateParamId, async (req, res) => {
    try {
        const notifications = await getReceivedNotifications(req.params.id);
        res.status(200).send(notifications);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

// Delete a notif by its id
router.delete('/:id', authenticateToken, validateParamId, async (req, res) => {
    try {
        await deleteNotification(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

//TODO can't use the middleware 2id due to type in the body find another way
// Insert a new notif
router.post('/', authenticateToken, validatePostNotif, async (req, res) => {
    try {
        const { sender_id, receiver_id, type } = req.body;

        //TODO move this block logic in the insertNotification
        const blocked = await isBlocked(sender_id, receiver_id);
        if (blocked) {
            log.error('[notifController]', 'you are blocked');
            throw new ForbiddenError('You are blocked');
        }

        await insertNotification(sender_id, receiver_id, type);
        res.sendStatus(201);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

// Update a notification's read_status information
router.put('/:id/update_read', authenticateToken, validateParamId, async (req, res) => {
    try {
        await setNotificationAsRead(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        sendErrorResponse(res, err);
    }
});

export default router
