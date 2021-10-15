const { Router } = require(`express`);
const router = new Router();
const pool = require(`../modules/pool.js`);

router.get(`/`, (req, res) => {
  console.log(`GET /tasks`);
  // TODO: temporary sendStatus
  res.sendStatus(200);
});

module.exports = router;
