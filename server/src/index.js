import express from 'express';
import { createUsersTable, seedUsersTable } from './models/userModel.js';
import userController from './controllers/userController.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import bodyParser from 'body-parser';

const app = express();


// Use the body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// // Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Set up the server
const port = process.env.PORT || 3001;
const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Create the table in the database and seed it with fake data
  await createUsersTable();
  await seedUsersTable();
});

// Set up the user routes
app.use('/users', userController);


export default server;