require('dotenv/config');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pinoHttp = require('pino-http');

const pino = pinoHttp({
  redact: ['req.headers["x-access-token"]'],
});

require("./app/helpers/date.prototype")();
// require('./cron')();
require('./app_configs')();

const app = express();

if (process.env.FRONTEND_URL) {

  let corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }

  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: 1 }));

app.use(pino);

const db = require("./app/models");
db.sequelize.sync();
// db.sequelize.sync({ alter: true  }).then(() => {
//   console.log("Alter tables.");
// });

//TODO: only in development
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

let glob = require('glob'),
  path = require('path');

glob.sync('./app/routes/**/*.js').forEach(function (file) {
  require(path.resolve(file))(app);
});


// // set port, listen for requests
// const PORT = process.env.PORT || 8088;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

module.exports = app;
