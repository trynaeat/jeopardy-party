import { User } from './user';
import { Game } from './game';
import { Role } from './role';
import { socketServer } from './socket-server';
import * as _ from 'lodash';

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
    _.remove(this._users, u => u === user);
  }

  private listenToUser(user: User) {
    user.socket.on('chat', (message: string) => {
      socketServer().to(`room_${this._id}`)
        .emit('message', user.username, message);
    });
    user.socket.on('request_role', (role: Role, username: string) => {
      if (role === Role.PLAYER) {
        const added = this._game.addPlayer(user, username);
        if (added) {
          user.socket.emit('role', Role.PLAYER);
        } else {
          user.socket.emit('room_error', 'Players are full!');
        }
      }
    });
    user.socket.on('disconnect', () => {
      this.removeUser(user);
    });
  }

}
