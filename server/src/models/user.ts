import { Socket } from 'socket.io';

export class User {
  private _id: string; // Unique ID for user, taken from Socket id
  private _username?: string; // User's screen name
  private _socket: Socket; // Socket.io socket associated with user
  private _winnings = 0; // If they're a player, their money total
  private _wager?: number; // Final jeopardy wager
  private _signature?: string; // User's drawn signature, as an SVG image
  private _finalAnswer?: string; // Answer to final jeopardy
  private _hasAnswered = false; // Whether they've answered final jeopardy
  private _lastWinnings = 0; // Last winnings/losings due to most recent response

  constructor(id: string, socket: Socket, username?: string,) {
    this._id = id;
    this._username = username;
    this._socket = socket;
  }

  public resetPlayer () {
    this._winnings = 0;
    this._wager = 0;
    this._finalAnswer = null;
    this._hasAnswered = false;
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  set username(username: string) {
    this._username = username;
  }

  get socket(): Socket {
    return this._socket;
  }

  get winnings(): number {
    return this._winnings;
  }

  set winnings(total: number) {
    this._winnings = total;
  }

  get wager(): number {
    return this._wager;
  }

  set wager(wager: number) {
    this._wager = wager;
  }

  get signature(): string {
    return this._signature;
  }

  set signature(sig: string) {
    this._signature = sig;
  }

  get finalAnswer(): string {
    return this._finalAnswer;
  }

  set finalAnswer(fa: string) {
    this._finalAnswer = fa;
  }

  get hasAnswered() {
    return this._hasAnswered;
  }

  set hasAnswered(ha: boolean) {
    this._hasAnswered = ha;
  }

  get lastWinnings() {
    return this._lastWinnings;
  }

  set lastWinnings(w: number) {
    this._lastWinnings = w;
  }
}

export class SanitizedUser {
  public username?: string;
  public winnings?: number;
  public signature?: string;
  public hasAnswered?: boolean;
  public lastWinnings?: number;

  constructor (user: User) {
    this.username = user.username;
    this.winnings = user.winnings;
    this.signature = user.signature;
    this.hasAnswered = user.hasAnswered;
    this.lastWinnings = user.lastWinnings;
  }
}
