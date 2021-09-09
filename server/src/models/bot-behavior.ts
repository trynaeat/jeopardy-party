import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, takeUntil } from 'rxjs/operators';
import { GameUpdate } from './game-update';
import { Logger } from '../utils/logger';
import { Actions } from './actions';
import { JudgeAction } from './judge-action';
import * as stringSimilarity from 'string-similarity';

interface IFinalAnswerEvent {
    username: string;
    finalAnswer: string;
};

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
    private _finalAnswers: IFinalAnswerEvent[] = [];

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
        this._socket.on('final_answer', (event: IFinalAnswerEvent[]) => {
            this._finalAnswers = event;
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
            if (state === 'readQuestion') {
                this.armBuzzers(update);
            }
            if (state === 'judgingAnswer') {
                this.judgeAnswer(update);
            }
            if (state === 'judgingFinal') {
                this.judgeFinal(update);
            }
        });
    }

    private armBuzzers (state: GameUpdate) {
        const question = state.activeQuestion.question;
        const words = state.activeQuestion.question.split(' ').length;
        // Average read speed of 250 wpm ~= 4 wps
        const waitTime = 250 * words;
        setTimeout(() => {
            this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.ARM_BUZZER);
        }, waitTime);
    }

    private judgeAnswer (state: GameUpdate) {
        const correct = this._compareAnswer(this._answer, state.activePlayer.lastAnswer);
        this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.ANSWER_RULING, { correct, username: state.activePlayer.username, value: state.activeQuestion.value  });
    }

    private judgeFinal (state: GameUpdate) {
        const correctPlayers = state.players.filter(p => {
            const found = this._finalAnswers.find(u => u.username === p.username);
            const response = found && found.finalAnswer;
            return this._compareAnswer(this._answer, response);
        })
        .map(p => p.username);

        this._socket.emit(Actions.JUDGE_ACTION, JudgeAction.RULE_FINAL, { correctPlayers });
    }

    /**
     * Returns true if judged correct, false otherwise
     * @param correct
     * @param actual
     */
    private _compareAnswer (correct: string, actual: string) {
        let response = (actual || '')
            .trim()
            .toLowerCase();
        const correctResponse = correct.toLowerCase();
        const similarity = stringSimilarity.compareTwoStrings(response, correctResponse);
        this._logger.debug(`Response: ${response}, Correct: ${correctResponse}, Similarity: ${similarity}`);

        return similarity >= 0.8;
    }
}