import jwt from 'jsonwebtoken';
import express from 'express';
import { getAllNotifications } from '../services/notificationsService.js';

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

export default router