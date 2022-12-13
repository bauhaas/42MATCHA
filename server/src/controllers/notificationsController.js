import jwt from 'jsonwebtoken';
import express from 'express';
import { getAllNotifications, deleteNotification, insertNotification } from '../services/notificationsService.js';
import log from '../config/log.js';

const router = express.Router();

// Get all notifs
router.get('/', async (req, res) => {
    try {
        log.info('[notifController]', 'enter in getAllNotifications');
        const notifications = await getAllNotifications();
        res.send(notifications);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a notif by it's id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[notifController]', 'enter in deleteNotifications');
        await deleteNotification(id);
        res.send({id});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insert a new notif
router.post('/', async (req, res) => {
    try {
        log.info('[notifController]', 'body: ', req.body);
        const { sender_id, user_id, type } = req.body;
        log.info('[notifController]', 'enter in insertNotification');
        const id = await insertNotification(sender_id, user_id, type);
        res.send({ id });
    } catch (err) {
            res.status(500).send(err.message);
    }
});


export default router