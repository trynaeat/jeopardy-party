import * as Koa from 'koa';
import { Server } from 'socket.io';
import * as socket from 'socket.io';
import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';

import { Lobby } from './lobby';
import { User, VirtualUser } from './user';
import { Logger } from '../utils/logger';

const SOCKET_PORT = 3001;
const HOSTNAME = '0.0.0.0';

let server: Server;
let botServer: socket.Namespace

export const initialize = (lobby: Lobby) =>  {
  const logger = Logger.getLogger();
  const app = new Koa();
  const socketServer = http.createServer(app.callback());
  const io = socket(socketServer);
  server = io;
  botServer = io.of('bots');
  io.on('connection', socket => {
    const uuid = uuidv4();
    lobby.addUser(new User(uuid, socket));
    socket.on('test', (userId: string) => {
      logger.debug(`test recieved from user ${userId}`);
      socket.broadcast.emit('ack');
    });
  });

  io.of('bots').on('connection', socket => {
    const uuid = uuidv4();
    logger.debug(`Bot connected ${uuid}`);
    lobby.addUser(new VirtualUser(uuid, socket));
    socket.emit('bot_initialized', socket.id);
  });

  socketServer.listen(SOCKET_PORT, HOSTNAME);
  logger.info(`Socket server listening on port ${SOCKET_PORT}`);
}

export const socketServer = () => {
  return server;
}

export const botSocketServer = () => {
  return botServer;
}
