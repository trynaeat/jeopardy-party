import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { GameUpdate } from './game-update';
import { Logger } from '../utils/logger';
import { Actions } from './actions';
import { JudgeAction } from './judge-action';
import * as stringSimilarity from 'string-similarity';

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
    private _answer = '';

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
        this._socket.on('question_answer', (answer: string) => {
            this._answer = answer;
        });
    }

    public disconnect () {
        this._socket.removeListener('sync');
        this._socket.removeListener('question_answer');
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
            if (state === 'judgingAnswer') {
                this.judgeAnswer(update);
            }
        });
    }

    private armBuzzers () {
        setTimeout(() => {
            this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.ARM_BUZZER);
        }, 3000);
    }

    private judgeAnswer (state: GameUpdate) {
        let response = state.activePlayer.lastAnswer;
        if (response) {
            response = response
                .trim()
                .toLowerCase();
        }
        const correctResponse = this._answer.toLowerCase();
        const similarity = stringSimilarity.compareTwoStrings(response, correctResponse);
        this._logger.debug(`Response: ${response}, Correct: ${correctResponse}, Similarity: ${similarity}`);
        let correct = false;
        if (similarity > 0.8) {
            correct = true;
        }

        this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.ANSWER_RULING, { correct, username: state.activePlayer.username, value: state.activeQuestion.value  });
    }
}