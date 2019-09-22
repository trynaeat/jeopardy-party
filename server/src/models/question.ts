import { Round } from './round';

export class Question {
    public category: string;
    public question: string;
    public value: number;
    public answer: string;
    public round: Round;
    public showNumber: number;
    public isDailyDouble: boolean;
    public year: number;
}

/**
 * Answer and Daily Double status are removed, may be sent to everyone
 */
export class SanitizedQuestion {
    public category: string;
    public question: string;
    public value: number;
    public round: Round;
    public showNumber: number;
    public year: number;

    constructor(question: Question) {
        this.category = question.category;
        this.question = question.question;
        this.value = question.value;
        this.round = question.round;
        this.showNumber = question.showNumber;
        this.year = question.year;
    }
}