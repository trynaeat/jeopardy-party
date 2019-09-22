import * as Router from 'koa-router';
import * as randomstring from 'randomstring';
import { Game, GameBoard, Lobby, Question, Room, Round } from '../models';
import { Pool } from 'pg';
import * as _ from 'lodash';

export const router = new Router();

router.post('/game', async ctx => {
  const id = randomstring.generate(7);
  const showNum = await getRandomShowNum(ctx.db);
  const board = await getShowBoard(ctx.db, showNum);
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

async function getAllShowNumbers(db: Pool) {
  const result = await db.query('SELECT DISTINCT(show_number) FROM questions ORDER BY show_number');
  return result.rows;
}

async function getRandomShowNum(db: Pool): Promise<number> {
  const showNumbers = await getAllShowNumbers(db);
	return _.get(showNumbers, [_.random(0, showNumbers.length), 'show_number']);
}

async function getShowBoard(db: Pool, showNum: number) {
  const q = 'SELECT * FROM questions WHERE show_number=$1 ORDER BY round DESC, category ASC';
  const result = _.get(await db.query(q, [showNum]), 'rows', []);
  const questions = _.map(result, q => {
    return {
      ...q,
      value: _.parseInt(_.replace(q.value, '$', '')),
    };
  }) as Question[];
  const rounds = _.groupBy(questions, 'round');
  const roundsGrouped = _.mapValues(rounds, round => {
    return _.mapValues(_.groupBy(round, 'category'), category => {
      return _.sortBy(category, 'value');
    });
  });
  const board: GameBoard = {
    [Round.JEOPARDY]: roundsGrouped[Round.JEOPARDY],
    [Round.DOUBLE_JEOPARDY]: roundsGrouped[Round.DOUBLE_JEOPARDY],
    [Round.FINAL_JEOPARDY]: roundsGrouped[Round.FINAL_JEOPARDY],
  };
  return board;
}
