import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pinoHttp from 'pino-http';
import appConfigs from './app_configs.js';
import db from './app/models/index.js';
import RouteLoader from './router_loader.js';

const pino = pinoHttp({
  redact: ['req.headers["x-access-token"]'],
});

const app = express();
appConfigs();
const frontendUrl = process.env.FRONTEND_URL;
const corsOptions = frontendUrl
  ? {
    origin: frontendUrl,
    credentials: true,
  }
  : {};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);

db.sequelize.sync();

const routes = await RouteLoader('./app/routes/**/*.js');
app.use('/', routes);

// set port, listen for requests
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;