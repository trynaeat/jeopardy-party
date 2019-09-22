import { Round } from './Round';
import { Question } from './Question';

export interface GameBoard {
    [Round.JEOPARDY]: {
        [category: string]: Question[];
    };
    [Round.DOUBLE_JEOPARDY]: {
        [category: string]: Question[];
    };
    [Round.FINAL_JEOPARDY]: {
        [category: string]: Question[];
    };
}
