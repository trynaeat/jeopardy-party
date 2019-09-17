import { Room } from './room';
import { User } from './user';
import * as randomstring from 'randomstring';

export class Lobby {
  private users: User[];
  private rooms: Room[];

  constructor () {
    this.rooms = [];
    this.users = [];
  }

  public addUser(user: User) {
    this.users.push(user);
    user.socket.join('lobby'); // Join user to overall lobby subject with everyone else
    this.listenToUser(user);
  }

  private listenToUser(user: User) {
    user.socket.on('create_room', () => {
      const id = randomstring.generate(7);
      const room = new Room(id);
      room.addUser(user);
      this.rooms.push(room);
      user.socket.emit('room_created', id); // Let client know it was created, give room id
    });

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
