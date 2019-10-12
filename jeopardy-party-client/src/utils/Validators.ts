export function validateWager(wager: number, currentWinnings: number) {
    if (typeof wager !== 'number') {
        return false;
    }
    if (wager > currentWinnings || wager < 1) {
        return false;
    }
    return true;
}
