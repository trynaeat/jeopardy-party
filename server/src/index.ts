import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as cors from '@koa/cors';
import { config } from './config';
import { router as gameRoutes } from './routes/game';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { Lobby, socketInitialize } from './models';
import { Pool } from 'pg';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { Logger } from './utils/logger';
import { LogLevel } from 'bunyan';

const argv = yargs(hideBin(process.argv))
  .options(
    {
      l: { type: 'string', alias: 'logLevel', default: 'INFO' },
      https: { type: 'boolean', default: false },
      d: { type: 'boolean', alias: 'debug', default: false },
    },
  )
  .parseSync();

config.logLevel = argv.l as LogLevel;
config.https = argv.https;
config.debug = argv.d;

const logger = Logger.init({ name: 'baseLogger', level: config.logLevel });

logger.info('Log level: ', logger.level());


const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/../ssl/server.key`),
  cert: fs.readFileSync(`${__dirname}/../ssl/server.crt`),
  ca: fs.readFileSync(`${__dirname}/../ssl/rootCA.crt`),
  requestCert: true,
  rejectUnauthorized: false
};

const app = new Koa();
const router = new Router();

const PORT = 3000;
const HOSTNAME = '0.0.0.0';

router.get('/*', ctx => {
  ctx.body = 'Hello, World!';
});

app.use(cors());
app.use(bodyParser());

app.use(gameRoutes.routes())
  .use(router.routes())
  .use(router.allowedMethods());


if (config.https) {
  https.createServer(httpsOptions, app.callback())
    .listen(PORT, HOSTNAME);
} else {
  http.createServer(app.callback())
    .listen(PORT, HOSTNAME);
}

const lobby = new Lobby();
app.context.lobby = lobby;
const db = new Pool(config.db);
logger.info('DB Connected');
app.context.db = db;
socketInitialize(lobby);


logger.info(`Server listening on port ${PORT}`);
