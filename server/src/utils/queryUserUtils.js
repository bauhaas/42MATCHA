const GET_ALL_USERS = `
  SELECT *
  FROM users
`;

const GET_USER_BY_ID = `
  SELECT *
  FROM users
  WHERE id = $1
`;

const INSERT_USER = `
  INSERT INTO users (first_name, last_name, email, password, longitude, latitude)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;

const DELETE_USER = `
  DELETE FROM users
  WHERE id = $1
`;

export const DBgetAllUsers = () => ({
  text: GET_ALL_USERS
});

export const DBgetUserById = (id) => ({
  text: GET_USER_BY_ID,
  values: [id]
});

export const DBinsertUser = (firstName, lastName, email, password, longitude, latitude) => ({
  text: INSERT_USER,
  values: [firstName, lastName, email, password, longitude, latitude]
});


export const DBdeleteUser = (id) => ({
  text: DELETE_USER,
  values: [id]
});