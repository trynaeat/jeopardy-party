import { Toast } from './Toast';
import { Role } from './Role';
import { GameBoard } from './GameBoard';
import { Round } from './Round';

export interface RootState {
    toasts: Toast[];
    role: Role;
    board: GameBoard | null;
    round: Round;
}
