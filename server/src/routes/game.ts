import * as Router from 'koa-router';
import * as randomstring from 'randomstring';
import { Game, GameBoard, Lobby, Question, Room, Round } from '../models';
import { GameUtils } from '../utils';
import { Pool } from 'pg';
import * as _ from 'lodash';

export const router = new Router();

router.post('/game', async ctx => {
  const id = randomstring.generate(7);
  const showNum = await GameUtils.getRandomShowNum(ctx.db);
  const board = await GameUtils.getShowBoard(ctx.db, showNum);
  const room = new Room(id, new Game(id, board));
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
