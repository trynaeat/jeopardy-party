import { Server } from 'socket.io';
import * as socket from 'socket.io';
import * as http from 'http';
import * as https from 'https';
import { v4 as uuidv4 } from 'uuid';

import { Lobby } from './lobby';
import { User, VirtualUser } from './user';
import { Logger } from '../utils/logger';

let server: Server;
let botServer: socket.Namespace

export const initialize = (lobby: Lobby, httpServer: http.Server | https.Server) =>  {
  const logger = Logger.getLogger();
  const io = socket(httpServer);
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
}

export const socketServer = () => {
  return server;
}

export const botSocketServer = () => {
  return botServer;
}
