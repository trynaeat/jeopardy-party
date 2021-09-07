import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { GameUpdate } from './game-update';
import { Logger } from '../utils/logger';
import { Actions } from './actions';
import { JudgeAction } from './judge-action';

export interface IBotBehavior {
    connect: () => void;
    disconnect: () => void;
}

export class JudgeBot implements IBotBehavior {

    private _logger = Logger.getLogger();
    private _socket:  SocketIOClient.Socket = null;
    private _gameState$ = new Subject<GameUpdate>();
    private _gameStateChange$: Observable<GameUpdate>;
    private _destroy$ = new Subject();

    constructor (socket: SocketIOClient.Socket) {
        this._socket = socket;

        this._gameStateChange$ = this._gameState$.pipe(
            distinctUntilKeyChanged('state'),
        );
    }

    public connect () {
        this.watchGameState();
        this._socket.on('sync', (update: GameUpdate) => {
            this._gameState$.next(update);
        });
    }

    public disconnect () {
        this._destroy$.next();
    }

    private watchGameState () {
        this._gameStateChange$.pipe(
            takeUntil(this._destroy$),
        )
        .subscribe(update => {
            const state = update.state;
            this._logger.debug(state);
            if (state === 'readQuestion') {
                this.armBuzzers();
            }
        });
    }

    private armBuzzers () {
        setTimeout(() => {
            this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.ARM_BUZZER);
        }, 3000);
    }
}