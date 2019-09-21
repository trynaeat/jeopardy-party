import { User } from './user';
import { socketServer } from './socket-server';
import * as _ from 'lodash';

export class Room {
  private _id: string;
  private _users: User[];

  get id(): string {
    return this._id;
  }

  get users(): User[] {
    return this._users;
  }

  constructor(id: string) {
    this._id = id;
    this._users = [];
  }

  public addUser(user: User) {
    this.users.push(user);
    user.socket.join(this._id); // Join user to room's Socket.io "Room"
    user.socket.emit('sync');
    this.listenToUser(user);
  }

  public removeUser(user: User) {
    _.remove(this._users, u => u === user);
  }

  private listenToUser(user: User) {
    user.socket.on('chat', (message: string) => {
      socketServer().to(this._id)
        .emit('message', user.username, message);
    });
    user.socket.on('disconnect', () => {
      this.removeUser(user);
    });
  }

}
