import jwt from 'jsonwebtoken';
import express from 'express';
import { getAllNotifications, deleteNotification } from '../services/notificationsService.js';

const router = express.Router();

// Get all notifs
router.get('/', async (req, res) => {
    try {
        console.log('get all notifications')
        const notifications = await getAllNotifications();
        res.send(notifications);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a notif by id
router.delete('/:id', async (req, res) => {
    try {
        console.log('delete  notifications')
        console.log(req.params);
        const id = req.params.id;
        await deleteNotification(id);
        res.send({id});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router