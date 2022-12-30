import jwt from 'jsonwebtoken';
import express from 'express';
import { getNotifById, getAllNotifications, getReceivedNotifications, deleteNotification, insertNotification, updateReadNotification, updateTimeNotification } from '../services/notificationsService.js';
import { isBlocked } from '../services/relationsService.js';
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

// Get notifs where user is receiver
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            throw '400: conversationId must be a number';
        }
        log.info('[notifController]', 'enter in getNotifById');
        const notifications = await getNotifById(id);
        res.send(notifications);
    } catch (err) {
        if (err.message.contains('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});


// Get notifs where user is receiver
router.get('/:id/receiver', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            throw '400: conversationId must be a number';
        }
        log.info('[notifController]', 'enter in getReceivedNotifications');
        const notifications = await getReceivedNotifications(id);
        res.send(notifications);
    } catch (err) {
        if (err.message.contains('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

// Delete a notif by its id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            throw '400: conversationId must be a number';
        }
        log.info('[notifController]', 'enter in deleteNotifications');
        await deleteNotification(id);
        res.send({id});
    } catch (err) {
        if (err.message.contains('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

// Insert a new notif
router.post('/', async (req, res) => {
    try {
        const { sender_id, receiver_id, type } = req.body;
        if (isNaN(sender_id) || isNaN(receiver_id)) {
            throw '400: sender_id and receiver_id must be a number';
        }

        const blocked = await isBlocked(receiver_id, sender_id);
        if (blocked) {
          throw 'You are blocked';
        }

        log.info('[notifController]', 'enter in insertNotification');
        await insertNotification(sender_id, receiver_id, type);
        res.sendStatus(200);
    } catch (err) {
        if (err.message === 'You are blocked') {
          res.status(404).send(err.message);
        } else if (err.message.contains('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

// Update a notification's read_status information
router.put('/:id/update_read', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            throw '400: userId must be a number';
        }

        log.info('[notifController]', 'enter in updateReadNotification');
        await updateReadNotification(id);
        res.send({ id });
    } catch (err) {
        if (err.message.contains('400')) {
            res.status(400).send(err.message)
        }
        res.status(500).send(err.message);
    }
});

export default router
