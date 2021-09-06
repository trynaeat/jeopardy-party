import * as io from 'socket.io-client';

export interface IBotBehavior {
    connect: () => void;
    disconnect: () => void;
}

export class JudgeBot implements IBotBehavior {
    private _socket:  SocketIOClient.Socket = null;

    public connect () {
        this._socket = io('http://localhost:3001/bots');
    }

    public disconnect () {

    }
}