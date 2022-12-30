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
import { insertMessage2 } from './services/messageService.js';
import { getConversations } from './services/conversationService.js';

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

// const socketUser = new Map();
// global.socketUser = socketUser;
var map = new Map();
global.map = map;

io.on('connection', (socket) => {
  log.info('[index.js]', `${socket.id} is connected!`);
  var user_id = socket.request._query['id'];
  log.info('[index.js]', user_id, typeof(user_id));

  updateStatusUser(user_id, true)
  map.set(user_id, socket);
  log.info('[index.js]', 'total sockets connected:', map.size);

  socket.on('disconnect', () => {
    console.log(user_id, "disconnecting");
    map.delete(user_id, socket);
    updateStatusUser(user_id, false)
  });

  socket.on('sendMessage', async (messagePayload) => {
    log.info('[index.js]', 'receive sendMessage event');
    log.info('[index.js]', 'payload:', messagePayload);

    const messageHistory = await insertMessage2(messagePayload);
    const fromSocket = map.get(String(messagePayload.from));
    const toSocket = map.get(String(messagePayload.to));

    if (fromSocket)
    {
      log.info('[index.js]', 'send messageHistory to the message author');
      io.to(fromSocket.id).emit('messageHistory', messageHistory);
    }
    if (toSocket)
    {
      log.info('[index.js]', 'send messageHistory to the receiver');
      io.to(toSocket.id).emit('messageHistory', messageHistory);

      const conversation = await getConversations(messagePayload.to);
      io.to(toSocket.id).emit('convUpdate', conversation);
    }
  });
});

server.listen(port, async () => {
  log.info('[index.js]', `Server listening on port ${port}`);
  await createUsersTable();
  await seedUsersTable();
  await createRelationsTable();
  await createNotificationsTable();
  await seedNotificationsTable();
  await createConversationTable();
  await createMessagesTable();
});

app.use('/users', userController);
app.use('/relations', relationsController);
app.use('/notifications', notificationsController);
app.use('/messages', messageController);
app.use('/conversations', conversationController)

export default server;