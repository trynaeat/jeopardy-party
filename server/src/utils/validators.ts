export function validateWager(wager: number, currentWinnings: number) {
    if (wager > currentWinnings || wager < 1) {
        return false;
    }
    return true;
}