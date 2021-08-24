export interface User {
    username: string;
    winnings?: number;
    hasBuzzed?: boolean;
    signature?: string; // SVG signature
    wager?: number;
    finalAnswer?: string;
}

export interface FinalAnswerEvent {
    id: string;
    username: string;
    finalAnswer: string;
    wager: number;
}
