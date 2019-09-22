import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as cors from '@koa/cors';
import { config } from './config';
import { initialize } from './auth/auth';
import { router as loginRoutes } from './routes/login';
import { router as gameRoutes } from './routes/game';
import * as https from 'https';
import * as fs from 'fs';
import { Lobby, socketInitialize, User } from './models';
import { Pool } from 'pg';

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
app.use(initialize());

app.use(loginRoutes.routes())
  .use(gameRoutes.routes())
  .use(router.routes())
  .use(router.allowedMethods());

https.createServer(httpsOptions, app.callback())
  .listen(PORT, HOSTNAME);

const lobby = new Lobby();
app.context.lobby = lobby;
const db = new Pool(config.db);
console.log('DB Connected');
app.context.db = db;
socketInitialize(lobby);


console.log(`Server listening on port ${PORT}`);
