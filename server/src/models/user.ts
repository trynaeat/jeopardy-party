import { Socket } from 'socket.io';

export class User {
  private _id: string; // Unique ID for user, taken from Socket id
  private _username?: string; // User's screen name
  private _socket: Socket; // Socket.io socket associated with user

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

  get socket(): Socket {
    return this._socket;
  }
}

export class SanitizedUser {
  private _username?: string;

  get username(): string {
    return this._username;
  }

  constructor (user: User) {
    this._username = user.username;
  }
}
