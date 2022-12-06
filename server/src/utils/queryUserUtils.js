// Get all users
const GET_ALL_USERS = `
  SELECT *
  FROM users
`;

// Get a user by their ID
const GET_USER_BY_ID = `
  SELECT *
  FROM users
  WHERE id = $1
`;

// Insert a new user
const INSERT_USER = `
  INSERT INTO users (name, age)
  VALUES ($1, $2)
  RETURNING id
`;

// Update a user's information
const UPDATE_USER = `
  UPDATE users
  SET name = $1, age = $2
  WHERE id = $3
`;

// Delete a user by their ID
const DELETE_USER = `
  DELETE FROM users
  WHERE id = $1
`;

// Define a function for getting all users
export const DBgetAllUsers = () => ({
    text: GET_ALL_USERS
  });

  // Define a function for getting a user by their ID
  export const DBgetUserById = (id) => ({
    text: GET_USER_BY_ID,
    values: [id]
  });

  // Define a function for inserting a new user
  export const DBinsertUser = (name, age) => ({
    text: INSERT_USER,
    values: [name, age]
  });

  // Define a function for updating a user's information
  export const DBupdateUser = (name, age, id) => ({
    text: UPDATE_USER,
    values: [name, age, id]
  });

  // Define a function for deleting a user by their ID
  export const DBdeleteUser = (id) => ({
    text: DELETE_USER,
    values: [id]
  });