import { StateMachine } from 'javascript-state-machine';
import { Question } from './question';
import { Round } from './round';
import { User } from './user';
import { PlayerAction } from './player-action';
import * as _ from 'lodash';

export class Game {
    public questions: Question[];
    public round = Round.JEOPARDY;
    public host: User;
    public judge: User;
    public players: User[] = [];
    public fsm = new StateMachine({
        init: 'awaitPlayers',
        transitions: [
            { name: 'startGame', from: 'awaitPlayers', to: 'questionBoard' },
            { name: 'selectQuestion', from: 'questionBoard', to: 'readQuestion' },
            { name: 'buzzIn', from: 'readQuestion', to: 'answerQuestion' },
        ],
    });

    public addPlayer(user: User) {
        if (this.players.length >= 3) {
            return false;
        }
        this.players.push(user);
        user.socket.on('playerAction', (action: PlayerAction, options: Object) => {
            switch(action) {
                case PlayerAction.BUZZ_IN:
                    this.fsm.buzzIn();
                    console.log(this.fsm.state);
            }
        });
        user.socket.on('disconnect', () => {
            this.removePlayer(user);
        });
        return true;
    }

    public removePlayer(user: User) {
        _.remove(this.players, p => p === user);
        user.socket.removeAllListeners('playerAction');
    }

    public setJudge(judge: User) {

    }

    public setHost(host: User) {

    }

    private listenToPlayer(user: User) {

    }

    private listenToJudge(user: User) {

    }

    private listentoHost(user: User) {

    }
}