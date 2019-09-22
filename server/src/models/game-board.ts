import { Round } from './round';
import { SanitizedQuestion, Question } from './question';

export interface GameBoard {
    [Round.JEOPARDY]: {
        [category: string]: Question[];
    };
    [Round.DOUBLE_JEOPARDY]: {
        [category: string]: Question[];
    };
    [Round.FINAL_JEOPARDY]: {
        [category: string]: Question[];
    }
}

export interface SanitizedGameBoard {
    [Round.JEOPARDY]: {
        [category: string]: SanitizedQuestion[];
    };
    [Round.DOUBLE_JEOPARDY]: {
        [category: string]: SanitizedQuestion[];
    };
    [Round.FINAL_JEOPARDY]: {
        [category: string]: SanitizedQuestion[];
    }
}