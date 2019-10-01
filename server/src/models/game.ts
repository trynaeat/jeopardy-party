import * as StateMachine from 'javascript-state-machine';
import { GameBoard } from './game-board';
import { Round } from './round';
import { User } from './user';
import { HostAction } from './host-action';
import { PlayerAction } from './player-action';
import { JudgeAction } from './judge-action';
import { GameUpdate } from './game-update';
import { Role } from './role';
import { Timer } from './timer';
import * as _ from 'lodash';
import { socketServer } from './socket-server';
import { Question } from './question';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class Game {
    private _roomId: string;
    public activeQuestion: Question;
    public activePlayer: User;
    public board: GameBoard;
    public round = Round.JEOPARDY;
    public host: User;
    public judge: User;
    public players: User[] = [];
    public buzzedPlayers: User[] = [];
    public buzzerTimer: Timer;
    public gameTimer: Timer;
    public wasCorrect: boolean;
    private spectators: User[] = [];
    private resetBuzzer$ = new Subject();
    public fsm = new StateMachine({
        init: 'awaitPlayers',
        transitions: [
            { name: 'startGame', from: 'awaitPlayers', to: 'questionBoard' },
            { name: 'selectQuestion', from: 'questionBoard', to: 'readQuestion' },
            { name: 'buzzIn', from: 'readQuestion', to: 'playerAnswer' },
            { name: 'judgeAnswer', from: 'playerAnswer', to: 'judgingAnswer' },
            { name: 'questionFail', from: 'judgingAnswer', to: 'readQuestion' },
            { name: 'showAnswer', from: 'judgingAnswer', to: 'showingAnswer' },
            { name: 'returnToBoard', from: 'showingAnswer', to: 'questionBoard' },
            { name: 'advanceRound', from: 'showingAnswer', to: 'roundAdvance' },
        ],
        methods: {
            onSelectQuestion: () => {
                this.buzzedPlayers = [];
            },
            onShowAnswer: () => {
                this.gameTimer = new Timer(3000, 100);
                const sub = this.gameTimer.timer$.subscribe((timeRemaining: number) => {
                    // Time's up! Go to judging answer.
                    if (timeRemaining < 1) {
                        sub.unsubscribe();
                        this.gameTimer = null;
                        this.fsm.returnToBoard();
                        this.syncAll();
                    }
                });
                this.gameTimer.startTimer();
            },
            onReturnToBoard: () => {
                this.wasCorrect = null;
                this.activePlayer = null;
                this.activeQuestion = null;
            },
        },
    });

    constructor (roomId: string, board: GameBoard) {
        this._roomId = roomId;
        this.board = board;
    }

    public addPlayer(user: User, username: string) {
        if (this.players.length >= 3) {
            return false;
        }
        user.username = username;
        this.players.push(user);
        user.socket.join(`room_${this._roomId}_players`);
        user.socket.emit('role', Role.PLAYER);
        this.listenToPlayer(user);
        user.socket.on('disconnect', () => {
            this.removePlayer(user);
        });
        this.syncAll();
        return true;
    }

    public removePlayer(user: User) {
        _.remove(this.players, p => p === user);
        user.socket.leave(`room_${this._roomId}_players`);
        user.socket.removeAllListeners('playerAction');
        this.syncAll();
    }

    private listenToPlayer(user: User) {
        user.socket.on('playerAction', (action: PlayerAction, options: any) => {
            switch(action) {
                case PlayerAction.BUZZ_IN:
                    if (this.fsm.can('buzzIn') && !this.buzzedPlayers.find(u => u === user)) {
                        this.fsm.buzzIn();
                        this.activePlayer = user;
                        this.buzzedPlayers.push(user);
                        this.buzzerTimer && this.buzzerTimer.resetTimer();
                        this.buzzerTimer = new Timer(5000, 100);
                        this.buzzerTimer.timer$.pipe(
                            takeUntil(this.resetBuzzer$),
                        )
                        .subscribe(timeRemaining => {
                            // Time's up! Go to judging answer.
                            if (timeRemaining < 1) {
                                this.fsm.judgeAnswer();
                                this.resetBuzzer$.next();
                                this.buzzerTimer = null;
                                this.syncAll();
                            }
                        });
                        this.syncAll();
                        this.buzzerTimer.startTimer();
                    }
            }
        });
    }

    public addSpectator(user: User) {
        this.spectators.push(user);
        user.socket.join(`room_${this._roomId}_spectators`);
        user.socket.emit('role', Role.SPECTATOR);
        user.socket.on('disconnect', () => {
            this.removeSpectator(user);
        });
        this.syncAll();
    }

    public removeSpectator(user: User) {
        _.remove(this.spectators, p => p === user);
        user.socket.leave(`room_${this._roomId}_spectators`);
        this.syncAll();
    }

    public setJudge(judge: User) {
        this.judge = judge;
        this.listenToJudge(judge);
        judge.socket.on('disconnect', () => {
            this.judge = null;
            this.syncAll();
        });
        this.syncAll();
    }

    public setHost(host: User) {
        this.host = host;
        this.listenToHost(host);
        host.socket.emit('role', Role.HOST);
        this.syncAll();
    }

    private listenToJudge(user: User) {
        user.socket.on(JudgeAction.ANSWER_RULING, (username: string, value: number, correct: boolean) => {
            if (this.fsm.is('playerAnswer')) {
                this.fsm.judgeAnswer();
            }
            if (this.fsm.is('judgingAnswer')) {
                const user = this.players.find(u => u.username === username);
                if (!user) return;
                this.wasCorrect = correct;
                if (this.buzzerTimer) {
                    this.buzzerTimer.resetTimer();
                    this.resetBuzzer$.next();
                    this.buzzerTimer = null;
                }
                if (correct) {
                    user.winnings += value;
                    this.fsm.showAnswer();
                    socketServer().to(`room_${this._roomId}`).emit('question_answer', this.activeQuestion.answer);
                    this.syncAll();
                } else {
                    user.winnings -= value;
                    if (this.buzzedPlayers.length === this.players.length) {
                        this.fsm.showAnswer();
                        socketServer().to(`room_${this._roomId}`).emit('question_answer', this.activeQuestion.answer);
                        this.syncAll();
                    } else {
                        this.fsm.questionFail();
                        this.syncAll();
                    }
                }
            }
        });
    }

    private listenToHost(user: User) {
        user.socket.on(HostAction.START_GAME, () => {
            if (this.players.length >= 2 && this.fsm.can('startGame')) {
                this.fsm.startGame();
                this.syncAll();
            }
        });
        user.socket.on(HostAction.SELECT_QUESTION, (category: string, qNum: number) => {
            if (this.fsm.can('selectQuestion')) {
                const selected = this.selectQuestion(category, qNum);
                if (selected.disabled || selected.answered) {
                    return;
                }
                this.activeQuestion = selected
                this.activeQuestion.answered = true; // Clear question off board
                this.fsm.selectQuestion();
                // Send the judge (and only the judge) the answer
                this.judge.socket.emit('question_answer', this.activeQuestion.answer);
                this.syncAll();
            }
        });
    }

    /**
     * Sync everyone in the game (spectator/player/judge/host) with the current state
     */
    private syncAll() {
        const state = new GameUpdate(this);
        socketServer().to(`room_${this._roomId}`).emit('sync', state);
    }

    /**
     * Select a question from the board, given category and q number (top to bottom)
     * @param catNum 
     * @param qNum 
     */
    private selectQuestion (category: string, qNum: number) {
        console.log(category);
        console.log(qNum);
        return this.board[this.round][category][qNum];
    }
}