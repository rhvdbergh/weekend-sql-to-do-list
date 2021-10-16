const pg = require(`pg`);

const pool = new pg.Pool({
  host: `localhost`,
  idleTimeoutMillis: 30000,
  database: `weekend-to-do-app`,
  port: 5432,
  max: 10,
});

pool.on(`connect`, () => {
  console.log(`Connected to PostgreSQL`);
});

pool.on(`error`, (err) => {
  console.log(`Error connecting to PostgreSQL:`, err);
});

module.exports = pool;
