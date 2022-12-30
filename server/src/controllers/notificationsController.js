import jwt from 'jsonwebtoken';
import express from 'express';
import { getAllNotifications, getReceivedNotifications, deleteNotification, insertNotification, updateReadNotification, updateTimeNotification } from '../services/notificationsService.js';
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

// Get notifs where user is sender
router.get('/:id/received', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[notifController]', 'enter in getReceivedNotifications');
        const notifications = await getReceivedNotifications(id);
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
        const { sender_id, receiver_id, type } = req.body;
        log.info('[notifController]', 'enter in insertNotification');
        await insertNotification(sender_id, receiver_id, type);
        res.sendStatus(200);
    } catch (err) {
            res.status(500).send(err.message);
    }
});

// Update a notification's read_status information
router.put('/:id/update_read', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[notifController]', req.body);
        log.info('[notifController]', 'enter in updateReadNotifications');
        await updateReadNotification(id);
        res.send({ id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a notification's updated_at information
router.put('/:id/update_time', async (req, res) => {
    try {
        const id = req.params.id;
        log.info('[notifController]', req.body);
        log.info('[notifController]', 'enter in updateTimeNotification');
        await updateTimeNotification(id);
        res.send({ id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router

// processus de recrutement (cb d'étapes, et quelles sont-elles ?)
// recruté sur mission ou profile
// politique concernant les certifications
// structure de l'entreprise (Revolve, Innovation, ...)
// Localisation (bureaux sur Strasbourg?)
