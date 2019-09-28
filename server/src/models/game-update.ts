import { Game } from './game';
import { SanitizedUser } from './user';
import { SanitizedGameBoard } from './game-board';
import * as _ from 'lodash';
import { SanitizedQuestion } from './question';
import { SanitizedTimer } from './timer';

/**
 * All of the game state that gets sent as an update to users to sync them
 * All data here is sanitized to remove things like answers and other such cheat-ey items
 * Socket references and other potential private data is removed from the users as well
 * (Fun fact, trying to send a socket reference over the socket causes a stack overflow)
 */
export class GameUpdate {
    public activeQuestion?: SanitizedQuestion;
    public activePlayer?: SanitizedUser;
    public host: SanitizedUser;
    public judge: SanitizedUser;
    public players: SanitizedUser[];
    public board: SanitizedGameBoard;
    public state: string;
    public buzzerTimer: SanitizedTimer;
    public gameTimer: SanitizedTimer;

    constructor(game: Game) {
        this.state = game.fsm.state;
        this.host = game.host && new SanitizedUser(game.host);
        this.judge = game.judge && new SanitizedUser(game.judge);
        this.players = game.players.map(user => new SanitizedUser(user));
        this.activeQuestion = game.activeQuestion ? new SanitizedQuestion(game.activeQuestion) : null;
        this.activePlayer = game.activePlayer ? new SanitizedUser(game.activePlayer) : null;
        this.buzzerTimer = game.buzzerTimer ? new SanitizedTimer(game.buzzerTimer) : null;
        this.gameTimer = game.gameTimer ? new SanitizedTimer(game.gameTimer) : null;
        this.board = _.mapValues(game.board, round => {
            return _.mapValues(round, questions => {
                return _.map(questions, q => {
                    return new SanitizedQuestion(q);
                })
            })
        })
    }
}