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
    public airDate: Date;
    public disabled?: boolean;
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
    public disabled?: boolean;

    constructor(question: Question) {
        this.category = question.category;
        this.question = question.question;
        this.value = question.value;
        this.round = question.round;
        this.showNumber = question.showNumber;
        this.year = question.year;
        this.disabled = question.disabled;
    }
}