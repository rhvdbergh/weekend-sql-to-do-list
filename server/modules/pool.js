const pg = require(`pg`);

let client;

if (process.env.DATABASE_URL) {
  client = new pg.Client({
    connectionString: process.env.DATABASE_URL || '',
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  client = new pg.Client({
    database: `weekend-to-do-app`,
    host: `localhost`,
    idle_in_transaction_session_timeout: 30000,
    port: 5432,
  });
}

client.connect();

client.on(`connect`, () => {
  console.log(`Connected to PostgreSQL`);
});

client.on(`error`, (err) => {
  console.log(`Error connecting to PostgreSQL:`, err);
});

module.exports = client;
