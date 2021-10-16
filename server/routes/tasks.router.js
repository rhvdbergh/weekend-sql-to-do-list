const { Router } = require(`express`);
const router = new Router();
const pool = require(`../modules/pool.js`);

// retrieves all the tasks in the db
router.get(`/`, (req, res) => {
  console.log(`GET /tasks`);
  // TODO: temporary sendStatus

  // build SQL query - select everything!
  let query = `SELECT * FROM "tasks" ORDER BY "id"`;

  pool
    .query(query)
    .then((response) => {
      console.log(`received pg response; rows:`, response.rows);
      res.send(response.rows);
    })
    .catch((err) => {
      handleError(err);
      res.sendStatus(500); // signal server error
    });
});

// adds a task to the db
router.post(`/`, (req, res) => {
  console.log(`POST /tasks`);

  let query = `
    INSERT INTO "tasks" 
    ("task")
    VALUES
    ($1);
  `;

  // parameterize the values
  let values = [req.body.task];

  pool
    .query(query, values)
    .then((response) => {
      console.log(`updated db`);
      res.sendStatus(201); // signal created
    })
    .catch((err) => {
      handleError(err);
      res.sendStatus(500); // signal server error
    });
});

// error handler for all errors
function handleError(err) {
  console.log(`There was an error connecting to PostgreSQL:`, err);
}

module.exports = router;
