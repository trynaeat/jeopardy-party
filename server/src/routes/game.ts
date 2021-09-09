import * as Router from 'koa-router';
import * as randomstring from 'randomstring';
import { Game, Lobby, Room } from '../models';
import { GameUtils } from '../utils';
import * as _ from 'lodash';
import { Logger } from '../utils/logger';
import { createBot } from '../models/user';
import { JudgeBot } from '../models/bot-behavior';

export const router = new Router();

router.post('/game', async ctx => {
  const logger = Logger.getLogger();
  const online = ctx.request.body && ctx.request.body.online;
  const id = randomstring.generate(7);
  const showNum = await GameUtils.getRandomShowNum(ctx.db);
  const board = await GameUtils.getShowBoard(ctx.db, showNum);
  const game = new Game({
    roomId: id,
    gameBoard: board,
    isOnline: online,
    buzzerTime: online ? 7000 : 5000,
  });
  const room = new Room(id, game);
  if (online) {
    logger.debug(`New online game room ${id}`);
    const judgeBot = await createBot(<Lobby>ctx.lobby);
    judgeBot.behavior = new JudgeBot(judgeBot.clientSocket);
    room.addUser(judgeBot);
    game.setJudge(judgeBot);
  } else {
    logger.debug(`New local game room ${id}`);
  }
  // Listen for room lifetime to end, then destroy it
  const subscription = room.destroy$.subscribe(() => {
    subscription.unsubscribe();
    room.teardown();
    (<Lobby>ctx.lobby).removeRoom(room);
  });
  (<Lobby>ctx.lobby).addRoom(room);
  ctx.body = { roomId: id };
  ctx.status = 200;
});

router.get('/game/:id', ctx => {
  const room = (<Lobby>ctx.lobby).rooms.find(room => room.id === ctx.params.id);
  if (!room) {
    return ctx.status = 404;
  }
  ctx.status = 200;
});
