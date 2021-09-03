export function validateWager(wager: number, currentWinnings: number) {
    if (typeof wager !== 'number') {
        return false;
    }
    if (wager > currentWinnings || wager < 0) {
        return false;
    }
    return true;
}
