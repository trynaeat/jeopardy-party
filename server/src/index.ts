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
import yargs, { conflicts } from 'yargs';

const argv = yargs(hideBin(process.argv))
  .options(
    {
      d: { type: 'boolean', default: false },
      https: { type: 'boolean', default: false },
    },
  )
  .parseSync();

config.debug = argv.d;
config.https = argv.https;
if (config.debug) {
  console.log('Debug mode on');
}


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
console.log('DB Connected');
app.context.db = db;
socketInitialize(lobby);


console.log(`Server listening on port ${PORT}`);
