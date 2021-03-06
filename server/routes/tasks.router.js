const { Router } = require(`express`);
const router = new Router();
const client = require(`../modules/pool.js`);

// retrieves all the tasks in the db
router.get(`/`, (req, res) => {
  console.log(`GET /tasks`);
  console.log(`query`, req.query.sort);

  // this will sanitize the input, guarding against SQL injection
  let orderBy = findSortOrder(req.query.sort);

  // build SQL query - select everything!
  let query = `SELECT * FROM "tasks" ORDER BY ${orderBy}`;

  client
    .query(query)
    .then((response) => {
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

  client
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

// DELETE route to remove specific task from server
router.delete(`/:id`, (req, res) => {
  console.log(`DELETE /tasks, id to delete:`, req.params.id);
  let query = `
    DELETE FROM "tasks"
    WHERE id=$1;
  `;

  //parameterize the values
  let values = [req.params.id];
  client
    .query(query, values)
    .then(() => {
      res.sendStatus(200); // send the OK
    })
    .catch((err) => {
      handleError(err);
      res.sendStatus(500); // signal server error
    });
});

// Updates tasks regarding complete / incomplete
router.put(`/:id`, (req, res) => {
  let complete = req.body.complete;
  let id = req.params.id;
  console.log(`PUT /tasks id=`, id);

  let query = `
    UPDATE "tasks"
    SET "complete" = $1, "time_completed" = CURRENT_TIMESTAMP
    WHERE ID = $2
  `;

  // parameterize user input
  let values = [complete, id];

  client
    .query(query, values)
    .then(() => {
      res.sendStatus(204); // send no content (=success)
    })
    .catch((err) => {
      handleError(err);
      res.sendStatus(500); // signal server error
    });
});

/*
    HELPER FUNCTIONS
*/

// error handler for all errors
function handleError(err) {
  console.log(`There was an error connecting to PostgreSQL:`, err);
}

function findSortOrder(sort) {
  let orderby;
  switch (sort) {
    case `az`:
      orderBy = `LOWER("task") ASC`; // will compare characters on lowercase letters only
      break;
    case `za`:
      orderBy = `LOWER("task") DESC`;
      break;
    case `dateAsc`:
      orderBy = `"time_completed" ASC`;
      break;
    case `dateDesc`:
      orderBy = `"time_completed" DESC`;
      break;
    default:
      orderBy = `"id"`;
      break;
  }
  return orderBy;
}

module.exports = router;
