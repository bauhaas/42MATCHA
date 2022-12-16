import pg from 'pg';

const pool = new pg.Pool({
  host: 'db', // the hostname of the postgres service
  user: 'admin', // the user specified in the docker-compose file
  password: 'password', // the password specified in the docker-compose file
  database: 'mydb', // the default database to connect to
  listen_addresses: "172.19.0.3",
  port: 5432
});

export default pool;