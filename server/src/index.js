import express from 'express';
import { createUsersTable, seedUsersTable } from './models/userModel.js';
import { createNotificationsTable, seedNotificationsTable } from './models/notificationsModel.js';
import userController from './controllers/userController.js';
import notificationsController from './controllers/notificationsController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import bodyParser from 'body-parser';
import cors  from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
import pool from './config/db.js';

const app = express();

dotenv.config();
app.use(cors());

// Use the body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// // Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Set up the server
const port = process.env.PORT || 3001;

const server = http.createServer(app);

import {Server} from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //TODO join all the rooms is in (all conv);
  socket.on('disconnect', () => {
    console.log(`🔥: ${socket.id} user disconnected`);
  });

  socket.on('getNotifications', async (data) => {
    console.log('test', data.token);
    const decoded = jwt.decode(data.token, { complete: true });
    console.log(decoded.header);
    console.log(decoded.payload);
    console.log(decoded.payload.id);
    try {
      const client = await pool.connect();
      const result = await client.query(
        `
      SELECT *
      FROM notifications
      WHERE user_id = $1
    `, [decoded.payload.id]
      );
      const notifications = result.rows[0];
      client.release();
      console.log(notifications);
      socket.emit('sendNotifications', notifications);
    } catch (err) {
      throw err;
    }
  });

});


server.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Create the table in the database and seed it with fake data
  await createUsersTable();
  await seedUsersTable();
  await createNotificationsTable();
  await seedNotificationsTable();
});

// Set up the user routes
app.use('/users', userController);
app.use('/notifications', notificationsController);


export default server;