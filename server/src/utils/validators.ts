export function validateWager(wager: number, currentWinnings: number) {
    if (wager > currentWinnings || wager < 0) {
        return false;
    }
    return true;
}