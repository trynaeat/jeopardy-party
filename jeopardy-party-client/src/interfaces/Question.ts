import { Round } from './Round';

export interface Question {
    category: string;
    question: string;
    value: number;
    round: Round;
    showNumber: number;
    year: number;
    answer?: string;
}
