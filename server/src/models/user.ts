import { Socket } from 'socket.io';

export class User {
  private _id: string; // Unique ID for user, taken from Socket id
  private _username?: string; // User's screen name
  private _socket: Socket; // Socket.io socket associated with user
  private _winnings = 0; // If they're a player, their money total
  private _signature?: string; // User's drawn signature, as an SVG image

  constructor(id: string, socket: Socket, username?: string,) {
    this._id = id;
    this._username = username;
    this._socket = socket;
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

  get signature(): string {
    return this._signature;
  }

  set signature(sig: string) {
    this._signature = sig;
  }
}

export class SanitizedUser {
  public username?: string;
  public winnings?: number;
  public signature?: string;

  constructor (user: User) {
    this.username = user.username;
    this.winnings = user.winnings;
    this.signature = user.signature;
  }
}
