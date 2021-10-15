const express = require(`express`);
const bodyParser = require(`body-parser`);

// set up the express app
const app = express();
// get the taskRouter that we will use
const taskRouter = require(`./routes/tasks.router.js`);

const PORT = process.env.PORT || 5000;

// sets up the public route to serve index.html
app.use(express.static(`./public`));
app.use(bodyParser.urlencoded({ extended: true }));

// use the taskRouter on any /tasks calls
app.use(`/tasks`, taskRouter);

app.listen(PORT, () => {
  console.log(`Server listening on Port`, PORT);
});
