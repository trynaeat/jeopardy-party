import { User } from './user';
import { socketServer } from './socket-server';

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
    this.listenToUser(user);
  }

  private listenToUser(user: User) {
    user.socket.on('chat', (message: string) => {
      socketServer().to(this._id)
        .emit('message', user.username, message);
    });
  }

}
