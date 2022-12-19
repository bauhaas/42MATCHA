import express from 'express';
import { createUsersTable, seedUsersTable } from './models/userModel.js';
import { createNotificationsTable, seedNotificationsTable } from './models/notificationsModel.js';
import { createBlocksTable } from './models/blockModel.js';
import { createMessagesTable } from './models/messageModel.js';
import messageController from './controllers/messageController.js';
import userController from './controllers/blockController.js';
import blockController from './controllers/blockController.js';
import notificationsController from './controllers/notificationsController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import bodyParser from 'body-parser';
import cors  from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
import pool from './config/db.js';
import log from './config/log.js';
import { Server } from 'socket.io';


const app = express();

dotenv.config();
app.use(cors());

// Use the body-parser middleware to parse request bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//modified to upload pictures
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Set up the server
const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

global.io = io;

const socketUser = new Map();
global.socketUser = socketUser;

io.on('connection', (socket) => {
  log.info('[index.js]', `${socket.id} is connected!`);

  console.log(socket.handshake);
  console.log(socket.handshake.query);

  // const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
  // log.info('[index.js]', 'that socket is linked to user', decoded.payload.id);
  // socketUser.set(socket.id, decoded.payload.id);


  //TODO join all the rooms the user is in on connection;
  // how can I know to which user the socket refers to here ?

  socket.on('disconnect', () => {
    log.info('[index.js]', `${socket.id} has disconnected`);
    socketUser.delete(socket.id);
  });

  socket.on('getNotifications', async (data) => {
    const decoded = jwt.decode(data.token, { complete: true });
    try {
      const client = await pool.connect();
      const result = await client.query(
        `
      SELECT *
      FROM notifications
      WHERE user_id = $1
    `, [decoded.payload.id]
      );
      const notifications = result.rows;
      client.release();
      socket.emit('receiveNotifs', notifications);
    } catch (err) {
      throw err;
    }
  });

});

server.listen(port, async () => {
  log.info('[index.js]', `Server listening on port ${port}`);

  // Create the table in the database and seed it with fake data
  await createUsersTable();
  await seedUsersTable();
  await createNotificationsTable();
  await seedNotificationsTable();
  await createBlocksTable();
  await createMessagesTable();
});

// Set up the routes
app.use('/users', userController);
app.use('/notifications', notificationsController);
app.use('/block', blockController);
app.use('/messages', messageController);


export default server;