import * as Koa from 'koa';
import { Server } from 'socket.io';
import * as socket from 'socket.io';
import * as http from 'http';

import { Lobby } from './lobby';
import { User } from './user';

const SOCKET_PORT = 3001;
const HOSTNAME = '0.0.0.0';

let server: Server;

export const initialize = (lobby: Lobby) =>  {
  const app = new Koa();
  const socketServer = http.createServer(app.callback());
  const io = socket(socketServer);
  server = io;
  io.on('connection', socket => {
    console.log('New user connected');
    socket.on('register_user', (username: string) => {
      const user = new User(socket.id, username, socket);
      lobby.addUser(user);
    });
    socket.on('test', (userId: string) => {
      console.log(`test recieved from user ${userId}`);
      socket.broadcast.emit('ack');
    })
  });

  socketServer.listen(SOCKET_PORT, HOSTNAME);
  console.log(`Socket server listening on port ${SOCKET_PORT}`);
}

export const socketServer = () => {
  return server;
}
