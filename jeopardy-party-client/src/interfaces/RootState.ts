import { Toast } from './Toast';
import { Role } from './Role';
import { GameBoard } from './GameBoard';
import { Round } from './Round';
import { GameStep } from './GameState';

export interface RootState {
    toasts: Toast[];
    role: Role;
    board: GameBoard | null;
    round: Round;
    currentState: GameStep;
}
