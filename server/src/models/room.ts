import { User } from './user';
import { Game, UserJoinError } from './game';
import { Role } from './role';
import { socketServer } from './socket-server';
import * as _ from 'lodash';
import { config } from '../config';

export class Room {
  private _id: string;
  private _users: User[];
  private _game: Game;

  get id(): string {
    return this._id;
  }

  get users(): User[] {
    return this._users;
  }

  constructor(id: string, game: Game) {
    this._id = id;
    this._users = [];
    this._game = game;
  }

  public addUser(user: User) {
    if (config.debug) {
      console.log(`user ${user.id} joined room ${this._id}`);
    }
    this.users.push(user);
    user.socket.join(`room_${this._id}`); // Join user to room's Socket.io "Room"
    /* First user to join is the host, subsequent ones default to spectator */
    if (!this._game.host) {
      this._game.setHost(user);
    } else {
      this._game.addSpectator(user);
    }
    this.listenToUser(user);
  }

  public removeUser(user: User) {
    if (config.debug) {
      console.log(`user ${user.id} left room ${this._id}`);
    }
    _.remove(this._users, u => u === user);
    if (this._game) {
      this._game.removePlayer(user);
      this._game.removeSpectator(user);
      this._game.removeHost(user);
      this._game.removeJudge(user);
    }
    user.socket.removeAllListeners('chat');
    user.socket.removeAllListeners('request_role');
    user.socket.removeAllListeners('disconnect');
  }

  private listenToUser(user: User) {
    user.socket.on('chat', (message: string) => {
      socketServer().to(`room_${this._id}`)
        .emit('message', user.username, message);
    });
    user.socket.on('request_role', (role: Role, username: string) => {
      if (role === Role.PLAYER) {
        try {
          this._game.addPlayer(user, username);
        } catch (err) {
          if (err instanceof UserJoinError) {
            user.socket.emit('room_error', err.message);
          }

          return;
        }
        user.socket.emit('role', Role.PLAYER);
      }
      if (role === Role.JUDGE) {
        if (!this._game.judge) {
          this._game.setJudge(user);
          user.socket.emit('role', Role.JUDGE);
        } else {
          user.socket.emit('room_error', 'Judge is taken!');
        }
      }
    });
    user.socket.on('disconnect', () => {
      this.removeUser(user);
    });
  }

}
