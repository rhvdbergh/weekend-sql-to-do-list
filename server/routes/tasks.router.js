const { Router } = require(`express`);
const router = new Router();
const pool = require(`../modules/pool.js`);

router.get(`/`, (req, res) => {
  console.log(`GET /tasks`);
  // TODO: temporary sendStatus

  // build SQL query - select everything!
  let query = `SELECT * FROM "tasks"`;

  pool
    .query(query)
    .then((response) => {
      console.log(`received pg response; rows:`, response.rows);
      res.send(response.rows);
    })
    .catch((err) => {
      handleError(err);
      res.sendStatus(500);
    });
});

// error handler for all errors
function handleError(err) {
  console.log(`There was an error connecting to PostgreSQL:`, err);
}

module.exports = router;
