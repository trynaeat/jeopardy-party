export interface User {
    username: string;
    winnings?: number;
    hasBuzzed?: boolean;
    signature?: string; // SVG signature
    wager?: number;
    finalAnswer?: string;
    lastWinnings?: number; // winnings/losings due to most recent response
}

export interface FinalAnswerEvent {
    id: string;
    username: string;
    finalAnswer: string;
    wager: number;
}
