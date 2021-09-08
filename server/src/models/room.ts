import { User } from './user';
import { Game, UserJoinError } from './game';
import { Role } from './role';
import { socketServer } from './socket-server';
import { Logger } from '../utils/logger';
import { Subject } from 'rxjs';

const roomLifetime = 1000 * 60 * 45; // 45 mins
export class Room {
  private _logger = Logger.getLogger();
  private _id: string;
  private _users: User[];
  private _game: Game;
  /** Emit to teardown and remove the room */
  private _destroy$ = new Subject();


  get destroy$() {
    return this._destroy$.asObservable();
  }

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

    setTimeout(() => {
      this._destroy$.next();
    }, roomLifetime);
  }

  public teardown () {
    this._logger.debug(`Tearing down room ${this._id}`);
    socketServer().to(`room_${this._id}`).emit('room_error', 'Room session closed');
    this._game.teardown();
    this._users.forEach(u => this.removeUser(u));
    this._game = null;
  }

  public addUser(user: User) {
    // Do nothing if user is already a member, just sync them back up
    if (this._users.find(u => u.id === user.id)) {
      this._game.syncUser(user);
      return;
    }
    this._logger.debug(`user ${user.id} joined room ${this._id}`);
    this._users.push(user);
    user.socket.join(`room_${this._id}`); // Join user to room's Socket.io "Room"
    /* First user to join is the host, subsequent ones default to spectator */
    /* Online games don't have a host */
    let isHost = false;
    if (!this._game.isOnline && !this._game.host && !user.isBot) {
      this._game.setHost(user);
      isHost = true;
    } else {
      this._game.addSpectator(user);
    }
    this.listenToUser(user);

    return isHost;
  }

  public removeUser(user: User) {
    this._logger.debug(`user ${user.id} left room ${this._id}`);
    // Game's over and host left, kill the room
    if (this._game.isFinished && this._game.host && this._game.host === user) {
      this._destroy$.next();
      return;
    }
    this._users = this._users.filter(u => u !== user);
    if (this._game) {
      this._game.removePlayer(user);
      this._game.removeSpectator(user);
      this._game.removeHost(user);
      this._game.removeJudge(user);
    }
    user.socket.leave(`room_${this._id}`);
    user.socket.removeAllListeners('chat');
    user.socket.removeAllListeners('request_role');
    user.socket.removeAllListeners('rejoin');
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
        user.socket.emit('role', { role: Role.PLAYER, uuid: user.uuid, username });
      }
      if (role === Role.JUDGE) {
        try {
          if (!this._game.judge) {
            this._game.setJudge(user);
            user.socket.emit('role', { role: Role.JUDGE, uuid: user.uuid });
          } else {
            user.socket.emit('room_error', 'Judge is taken!');
          }
        } catch (err) {
          if (err instanceof UserJoinError) {
            user.socket.emit('room_error', err.message);
          }
        }
      }
      if (role === Role.SPECTATOR) {
        this._game.addSpectator(user);
      }
    });
    user.socket.on('rejoin', (uuid: string) => {
      user.uuid = uuid;
      try {
        this._game.rejoin(user);
      } catch (err) {
        if (err instanceof UserJoinError) {
          user.socket.emit('room_error', err.message);
        }
      }
    });
    user.socket.on('disconnect', () => {
      this.removeUser(user);
    });
  }

}
