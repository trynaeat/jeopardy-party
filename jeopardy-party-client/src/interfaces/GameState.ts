import { GameBoard } from './GameBoard';
import { User } from './User';

export enum GameStep {
    PRE_GAME = 'waitingForGame',
    AWAIT_PLAYERS = 'awaitPlayers',
    QUESTION_BOARD = 'questionBoard',
}

export interface GameState {
    host: User;
    judge: User;
    players: User[];
    board: GameBoard;
    state: GameStep;
}
