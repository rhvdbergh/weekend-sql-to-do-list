const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => {
  console.log(`GET /tasks`);
  // TODO: temporary sendStatus
  res.sendStatus(200);
});

module.exports = router;
