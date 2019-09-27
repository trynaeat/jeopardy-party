import * as StateMachine from 'javascript-state-machine';
import { GameBoard } from './game-board';
import { Round } from './round';
import { User } from './user';
import { HostAction } from './host-action';
import { PlayerAction } from './player-action';
import { GameUpdate } from './game-update';
import { Role } from './role';
import * as _ from 'lodash';
import { socketServer } from './socket-server';
import { Question } from './question';

export class Game {
    private _roomId: string;
    public activeQuestion: Question;
    public activePlayer: User;
    public board: GameBoard;
    public round = Round.JEOPARDY;
    public host: User;
    public judge: User;
    public players: User[] = [];
    private spectators: User[] = [];
    public fsm = new StateMachine({
        init: 'awaitPlayers',
        transitions: [
            { name: 'startGame', from: 'awaitPlayers', to: 'questionBoard' },
            { name: 'selectQuestion', from: 'questionBoard', to: 'readQuestion' },
            { name: 'buzzIn', from: 'readQuestion', to: 'answerQuestion' },
        ],
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
                    if (this.fsm.can('buzzIn')) {
                        this.fsm.buzzIn();
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
        judge.socket.emit('role', Role.JUDGE);
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

    }

    private listenToHost(user: User) {
        user.socket.on(HostAction.START_GAME, () => {
            if (this.players.length >= 2 && this.fsm.can('startGame')) {
                this.activePlayer = this.players[0];
                this.fsm.startGame();
                this.syncAll();
            }
        });
        user.socket.on(HostAction.SELECT_QUESTION, (category: string, qNum: number) => {
            if (this.fsm.can('selectQuestion')) {
                this.activeQuestion = this.selectQuestion(category, qNum);
                this.fsm.selectQuestion();
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