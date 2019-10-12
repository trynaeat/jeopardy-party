import { GameBoard } from './GameBoard';
import { User } from './User';
import { Question } from './Question';
import { ITimer } from './Timer';
import { Round } from './Round';

export enum GameStep {
    PRE_GAME = 'waitingForGame',
    AWAIT_PLAYERS = 'awaitPlayers',
    QUESTION_BOARD = 'questionBoard',
    READ_QUESTION = 'readQuestion',
}

export interface GameState {
    host: User;
    judge: User;
    players: User[];
    board: GameBoard;
    state: GameStep;
    activePlayer?: User;
    playersTurn?: User;
    activeQuestion?: Question;
    buzzerTimer?: ITimer;
    gameTimer?: ITimer;
    round: Round;
}
