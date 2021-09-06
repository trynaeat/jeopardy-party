import { config } from '../config';
import { Room } from './room';
import { User, VirtualUser } from './user';
import { Logger } from '../utils/logger';

export class Lobby {
  private _logger = Logger.getLogger();
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
    // Do nothing if they already are a member
    if (this._users.find(u => u.id === user.id)) {
      return;
    }
    this._users.push(user);
    user.socket.join('lobby'); // Join user to overall lobby subject with everyone else
    this.listenToUser(user);
  }

  public removeUser(user: User) {
    this._users = this._users.filter(u => u !== user);
    user.socket.leave('lobby');
    user.socket.removeAllListeners('game_join');
    this._logger.debug(`User ${user.id} disconnected from Lobby`);
  }

  public getUser(id: string) {
    return this._users.find(u => u.id === id);
  }

  public addRoom(room: Room) {
    this._rooms.push(room);
  }

  public removeRoom(room: Room) {
    this._rooms = this._rooms.filter(r => r.id !== room.id);
  }

  private listenToUser(user: User) {
    this._logger.debug(`New User Registered ${user.id}`);
    user.socket.on('game_join', (roomId: string) => {
      // Leave any other rooms
      this.rooms.forEach(r => {
        if (r.id !== roomId) {
          r.removeUser(user);
        }
      });

      const room = this.rooms.find(room => room.id === roomId);
      if (room) {
        room.addUser(user);
        return;
      }
      this._logger.error('error joining room');
      user.socket.emit('room_error', 'Attempted to join an invalid room.');
    });

    user.socket.on('disconnect', () => {
      this.removeUser(user);
    });
  }
}
