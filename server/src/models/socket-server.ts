import * as Koa from 'koa';
import { Server } from 'socket.io';
import * as socket from 'socket.io';
import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';

import { Lobby } from './lobby';
import { User } from './user';
import { Logger } from '../utils/logger';

const SOCKET_PORT = 3001;
const HOSTNAME = '0.0.0.0';

let server: Server;

export const initialize = (lobby: Lobby) =>  {
  const logger = Logger.getLogger();
  const app = new Koa();
  const socketServer = http.createServer(app.callback());
  const io = socket(socketServer);
  server = io;
  io.on('connection', socket => {
    const uuid = uuidv4();
    lobby.addUser(new User(uuid, socket));
    socket.on('test', (userId: string) => {
      logger.debug(`test recieved from user ${userId}`);
      socket.broadcast.emit('ack');
    });
  });

  socketServer.listen(SOCKET_PORT, HOSTNAME);
  logger.info(`Socket server listening on port ${SOCKET_PORT}`);
}

export const socketServer = () => {
  return server;
}
