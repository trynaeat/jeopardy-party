import * as Router from 'koa-router';
import * as randomstring from 'randomstring';
import { Lobby, Room } from '../models';

export const router = new Router();

router.post('/game', ctx => {
  const id = randomstring.generate(7);
  const room = new Room(id);
  (<Lobby>ctx.lobby).addRoom(room);
  ctx.body = { roomId: id };
});

router.get('/game/:id', ctx => {
  const room = (<Lobby>ctx.lobby).rooms.find(room => room.id === ctx.params.id);
  if (!room) {
    return ctx.status = 404;
  }
  ctx.status = 200;
});
