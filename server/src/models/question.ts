import { Round } from './round';

export class Question {
    public category: string;
    public question: string;
    public value: number;
    public answer?: string;
    public round: Round;
    public showNumber: number;
    public isDailyDouble: boolean;
    public year: number;
}