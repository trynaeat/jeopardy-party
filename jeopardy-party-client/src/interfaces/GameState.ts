import { GameBoard } from './GameBoard';
import { User } from './User';

export interface GameState {
    host: User;
    judge: User;
    players: User[];
    board: GameBoard;
    state: string;
}
