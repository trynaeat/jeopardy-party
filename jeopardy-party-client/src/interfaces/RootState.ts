import { Toast } from './Toast';
import { Role } from './Role';
import { GameBoard } from './GameBoard';
import { Round } from './Round';
import { GameStep } from './GameState';
import { User } from './User';
import { Question } from './Question';
import { ITimer } from './Timer';

export interface RootState {
    toasts: Toast[];
    role: Role;
    board: GameBoard | null;
    round: Round;
    currentState: GameStep;
    players: User[];
    currentUser?: User;
    activeQuestion?: Question;
    activePlayer?: User;
    playersTurn?: User;
    buzzerTimer?: ITimer;
    gameTimer?: ITimer;
    judge?: User;
    answer?: string;
}
