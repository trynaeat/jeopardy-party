import { Socket } from 'socket.io';
import * as io from 'socket.io-client';
import { Lobby } from '.';
import { IBotBehavior } from './bot-behavior';

export class User {
  private _uuid: string; // socket-independent unique ID for user. This persists a user even if they disconnect
  private _username?: string; // User's screen name
  protected _socket: Socket; // Socket.io socket associated with user
  private _winnings = 0; // If they're a player, their money total
  private _wager?: number; // Final jeopardy wager
  private _signature?: string; // User's drawn signature, as an SVG image
  private _finalAnswer?: string; // Answer to final jeopardy
  private _hasAnswered = false; // Whether they've answered final jeopardy
  private _lastWinnings = 0; // Last winnings/losings due to most recent response
  protected _isBot = false;

  constructor(uuid: string, socket?: Socket, username?: string,) {
    this._uuid = uuid;
    this._username = username;
    this._socket = socket;
  }

  public resetPlayer () {
    this._winnings = 0;
    this._wager = 0;
    this._lastWinnings = 0;
    this._finalAnswer = null;
    this._hasAnswered = false;
  }

  syncPlayer (user: User) {
    this._winnings = user.winnings;
    this._wager = user.wager;
    this._lastWinnings = user.lastWinnings;
    this._finalAnswer = user.finalAnswer;
    this._hasAnswered = user.hasAnswered;
  }

  /**
   * Get socket.io id
   */
  get id(): string {
    return this._socket.id;
  }

  get uuid() : string {
    return this._uuid;
  }

  get isBot () {
    return this._isBot;
  }

  set uuid(id: string) {
    this._uuid = id;
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

export class VirtualUser extends User {
  private _behavior: IBotBehavior;
  private _clientSocket: SocketIOClient.Socket;

  constructor(uuid: string, socket: Socket) {
    super(uuid, socket);
    this._isBot = true;
  }

  public connect () {
    this._behavior.connect();
  }

  public disconnect () {
    this._behavior.disconnect();
  }

  public set clientSocket (socket: SocketIOClient.Socket) {
    this._clientSocket = socket;
  }
}

export function createBot (lobby: Lobby): Promise<VirtualUser> {
  return new Promise((resolve, reject) => {
    const clientSocket = io('http://localhost:3001/bots');
    clientSocket.on('bot_initialized', (id: string) => {
      const user = lobby.getUser(id) as VirtualUser;
      if (!user) {
        reject('Bot not found after initialization');
        return;
      }
      user.clientSocket = clientSocket;
      user.username = id;
      resolve(user);
    });
  })
}
