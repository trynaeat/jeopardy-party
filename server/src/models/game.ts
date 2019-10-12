import * as StateMachine from 'javascript-state-machine';
import { GameBoard } from './game-board';
import { Round } from './round';
import { User, SanitizedUser } from './user';
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
import { validateWager } from '../utils/validators';

export class Game {
    private _roomId: string;
    public activeQuestion: Question;
    public activePlayer: User; // Player currently buzzed in
    public playersTurn: User; // Player whose turn it is
    public board: GameBoard;
    public round = Round.JEOPARDY;
    public host: User;
    public judge: User;
    public players: User[] = [];
    public buzzedPlayers: User[] = [];
    public wageredPlayers: User[] = [];
    public buzzerTimer: Timer;
    public gameTimer: Timer;
    public wasCorrect: boolean;
    private spectators: User[] = [];
    private resetBuzzer$ = new Subject();
    private resetGameTimer$ = new Subject();
    public fsm = new StateMachine({
        init: 'awaitPlayers',
        transitions: [
            { name: 'startGame', from: 'awaitPlayers', to: 'questionBoard' },
            { name: 'selectQuestion', from: 'questionBoard', to: 'readQuestion' },
            { name: 'armBuzzers', from: 'readQuestion', to: 'buzzersArmed' },
            { name: 'buzzIn', from: 'buzzersArmed', to: 'playerAnswer' },
            { name: 'skipQuestion', from: 'buzzersArmed', to: 'showingAnswer' },
            { name: 'judgeAnswer', from: 'playerAnswer', to: 'judgingAnswer' },
            { name: 'questionFail', from: 'judgingAnswer', to: 'buzzersArmed' },
            { name: 'showAnswer', from: 'judgingAnswer', to: 'showingAnswer' },
            { name: 'returnToBoard', from: 'showingAnswer', to: 'questionBoard' },
            { name: 'advanceRound', from: 'showingAnswer', to: 'roundAdvance' },
            { name: 'advanceToBoard', from: 'roundAdvance', to: 'questionBoard' },
            { name: 'advanceToFinal', from: 'roundAdvance', to: 'finalWager' },
            { name: 'finishWager', from: 'finalWager', to: 'finalJeopardy' },
            { name: 'showAnswers', from: 'finalJeopardy', to: 'showingFinalAnswer' },
            { name: 'endGame', from: 'showingFinalAnswer', to: 'showingWinner' },
        ],
        methods: {
            onStartGame: () => {
                this.playersTurn = this.players[0];
            },
            onSelectQuestion: () => {
                this.buzzedPlayers = [];
            },
            onAdvanceRound: () => {
                this.wasCorrect = null;
                this.activePlayer = null;
                this.activeQuestion = null;
                if (this.round === Round.JEOPARDY) {
                    this.round = Round.DOUBLE_JEOPARDY;
                    this.playersTurn = _.sortBy(this.players, 'winnings')[0]; // Player with lowest total starts next round
                } else {
                    this.round = Round.FINAL_JEOPARDY;
                    this.playersTurn = null;
                }
                this.gameTimer = new Timer(3000, 100);
                this.gameTimer.timer$
                .pipe(
                    takeUntil(this.resetGameTimer$),
                )
                .subscribe((timeRemaining: number) => {
                    if (timeRemaining < 1) {
                        this.resetGameTimer$.next();
                        this.gameTimer = null;
                        if (this.round === Round.FINAL_JEOPARDY) {
                            this.fsm.advanceToFinal();
                        } else {
                            this.fsm.advanceToBoard();
                        }
                        this.syncAll();
                    }
                });
                this.gameTimer.startTimer();
            },
            onAdvanceToFinal: () => {
                /* Anyone with less than 0 bucks is out of the game */
                _.remove(this.players, p => {
                    if (p.winnings < 1) {
                        p.socket.emit('role', Role.SPECTATOR);
                        return true;
                    }
                });
                /* set 30 second timer to enter wagers */
                this.resetGameTimer$.next();
                this.gameTimer = new Timer(30000, 100);
                this.gameTimer.timer$.pipe(
                    takeUntil(this.resetGameTimer$),
                )
                .subscribe((timeRemaining: number) => {
                    if (timeRemaining < 1) {
                        this.resetGameTimer$.next();
                        this.gameTimer = null;
                        /* Anyone who hasn't bet yet gets a bet of $0 */
                        this.players = this.players.map(p => {
                            if (!p.wager) {
                                p.wager = 0;
                            }
                            return p;
                        });
                        this.fsm.finishWager();
                        this.syncAll();
                    }
                });
                this.gameTimer.startTimer();
            },
            onQuestionFail: () => {
                this.activePlayer = null;
            },
            onShowAnswer: () => {
                this.activeQuestion.answered = true;
                this.gameTimer = new Timer(3000, 100);
                this.gameTimer.timer$
                .pipe(
                    takeUntil(this.resetGameTimer$),
                )
                .subscribe((timeRemaining: number) => {
                    // Time's up! Go back to the board or advance the round.
                    if (timeRemaining < 1) {
                        this.resetGameTimer$.next();
                        this.gameTimer = null;
                        if (this.allAnswered(this.round)) {
                            this.fsm.advanceRound();
                            this.syncAll();
                        } else if (this.round === Round.FINAL_JEOPARDY) {
                            this.fsm.endGame();
                        } else {
                            this.fsm.returnToBoard();
                        }
                        this.syncAll();
                    }
                });
                this.gameTimer.startTimer();
            },
            onSkipQuestion: () => {
                this.activeQuestion.answered = true;
                const lastPlayerIdx = _.indexOf(this.players, this.activePlayer);
                this.playersTurn = this.players[(lastPlayerIdx + 1) % this.players.length];
                this.activeQuestion = null;
                this.wasCorrect = false;
                this.gameTimer = new Timer(3000, 100);
                this.gameTimer.timer$
                .pipe(
                    takeUntil(this.resetGameTimer$),
                )
                .subscribe((timeRemaining: number) => {
                    // Time's up! Go back to the board or advance the round.
                    if (timeRemaining < 1) {
                        this.resetGameTimer$.next();
                        this.gameTimer = null;
                        // can't skip during final jeopardy, so no check here
                        if (this.allAnswered(this.round)) {
                            this.fsm.advanceRound();
                            this.syncAll();
                        } else {
                            this.fsm.returnToBoard();
                        }
                        this.syncAll();
                    }
                });
                this.gameTimer.startTimer();
            },
            onReturnToBoard: () => {
                if (this.wasCorrect) {
                    this.playersTurn = this.activePlayer; // if the last person to answer got it right, they get to pick next Q
                } else {
                    // Else get next player in line
                    const lastPlayerIdx = _.indexOf(this.players, this.activePlayer);
                    this.playersTurn = this.players[(lastPlayerIdx + 1) % this.players.length];
                }
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
        this.syncAll(true);
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
        user.socket.on('setSignature', (signature: string) => {
            user.signature = signature;
            // I keep the signatures a separate event from a main game state sync because they can get large
            socketServer().to(`room_${this._roomId}`).emit('updatePlayer', new SanitizedUser(user));
        });
        user.socket.on('placeWager', (wager: number) => {
            if (this.fsm.is('finalWager') && validateWager(wager, user.winnings)) {
                user.wager = wager;
                this.wageredPlayers.push(user);
                this.wageredPlayers = _.uniq(this.wageredPlayers);
                if (this.wageredPlayers.length === this.players.length) {
                    this.resetGameTimer$.next();
                    this.fsm.finishWager();
                }
                this.syncAll();
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
        user.socket.on(JudgeAction.ARM_BUZZER, () => {
            if (this.fsm.can('armBuzzers')) {
                this.fsm.armBuzzers();
                this.syncAll();
            }
        });
        user.socket.on(JudgeAction.SKIP_QUESTION, () => {
            if (this.fsm.can('skipQuestion')) {
                socketServer().to(`room_${this._roomId}`).emit('question_answer', this.activeQuestion.answer);
                this.fsm.skipQuestion();
                this.syncAll();
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
     * * @param firstUpdate if this is an update on a new player connecting, we may send additional information (like player signatures)
     */
    private syncAll(firstUpdate = false) {
        const state = new GameUpdate(this, firstUpdate);
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

    /**
     * Check if every question in the round has been answered
     * @param round 
     */
    private allAnswered (round: Round) {
        return _.every(this.board[this.round], cat => _.every(cat, q => q.answered || q.disabled));
    }
}