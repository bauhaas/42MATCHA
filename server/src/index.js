import express from 'express';
import { createUsersTable, seedUsersTable } from './models/userModel.js';
import { createNotificationsTable, seedNotificationsTable } from './models/notificationsModel.js';
import { createMessagesTable } from './models/messageModel.js';
import { createRelationsTable } from './models/relationsModel.js';
import messageController from './controllers/messageController.js';
import userController from './controllers/userController.js';
import conversationController from './controllers/conversationController.js';
import notificationsController from './controllers/notificationsController.js';
import relationsController from './controllers/relationsController.js';
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
import { updateStatusUser } from './services/userService.js';
import { createConversationTable } from './models/conversationModel.js';
import { createMessage } from './services/messageService.js';
import { getConversationsOf } from './services/conversationService.js';
import { isBlocked } from './services/relationsService.js';
import { createFilesModel } from './models/filesModel.js';
import path, {join, dirname} from 'path';
const app = express();

dotenv.config();
app.use(cors());

// app.use(express.static('uploads'));

// Use the body-parser middleware to parse request bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//modified to upload pictures
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const uploadsPath = dirname(import.meta.url) + '/uploads';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.use('/uploads', express.static(__dirname + '../uploads'));

// Set up the server
const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

global.io = io;

// const socketUser = new Map();
// global.socketUser = socketUser;
var map = new Map();
global.map = map;

io.on('connection', (socket) => {
  var user_id = socket.request._query['id'];

  updateStatusUser(user_id, true)
  map.set(user_id, socket);
  io.emit('userConnect', user_id);
  
  socket.on('disconnect', async () => {
    map.delete(user_id, socket);
    const user = await updateStatusUser(user_id, false)
    io.emit('userDisconnect', {id: user_id, status: user.status});
  });

  socket.on('sendMessage', async (messagePayload) => {

    const messageHistory = await createMessage(messagePayload);
    if (messageHistory === null) {
      return ;
    }
    const fromSocket = map.get(String(messagePayload.from));
    const toSocket = map.get(String(messagePayload.to));

    if (fromSocket)
    {
      io.to(fromSocket.id).emit('messageHistory', messageHistory);
    }
    if (toSocket)
    {
      io.to(toSocket.id).emit('messageHistory', messageHistory);

      const conversation = await getConversationsOf(messagePayload.to);
      io.to(toSocket.id).emit('convUpdate', conversation);
    }
  });
});

server.listen(port, async () => {
  await createUsersTable();
  await createFilesModel();
  await createRelationsTable();
  await createNotificationsTable();
  await createConversationTable();
  await createMessagesTable();

  await seedUsersTable();
  await seedNotificationsTable();
});

app.use('/users', userController);
app.use('/relations', relationsController);
app.use('/notifications', notificationsController);
app.use('/messages', messageController);
app.use('/conversations', conversationController)

export default server;