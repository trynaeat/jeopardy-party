import { Room } from './room';
import { User } from './user';

export class Lobby {
  private _users: User[];
  private _rooms: Room[];

  constructor () {
    this._rooms = [];
    this._users = [];
  }

  get rooms(): Room[] {
    return this._rooms;
  }

  public addUser(user: User) {
    this._users.push(user);
    user.socket.join('lobby'); // Join user to overall lobby subject with everyone else
    this.listenToUser(user);
  }

  public addRoom(room: Room) {
    this._rooms.push(room);
  }

  private listenToUser(user: User) {
    user.socket.on('join_room', (roomId: string) => {
      user.socket.leaveAll();
      const room = this.rooms.find(room => room.id === roomId);
      if (room) {
        return room.addUser(user);
      }
      user.socket.emit('room_error', 'Attempted to join an invalid room.');
    });
  }
}
