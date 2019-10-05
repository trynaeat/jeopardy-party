import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { GameBoard, GameState, GameStep, Question, Role, RootState, Round, ITimer, Toast, User } from './interfaces';
import { Timer } from './utils/Timer';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';

Vue.use(Vuex);

let timerSub: Subscription;
let buzzerTimer: Timer;

/**
 * Note anything with the STORE_ prefix gets called automagically by vue-socket.io
 * when a matching event arrives.
 */
const store: StoreOptions<RootState> = {
  state: {
    toasts: [],
    role: Role.SPECTATOR,
    board: null,
    round: Round.JEOPARDY,
    currentState: GameStep.PRE_GAME,
    currentUser: undefined,
    players: [],
    activeQuestion: undefined,
    activePlayer: undefined,
    playersTurn: undefined,
    buzzerTimer: undefined,
    judge: undefined,
    answer: undefined,
  },
  mutations: {
    pushToast(state, toast: Toast) {
      // Only keep latest 5 toasts
      if (state.toasts.length >= 5) {
        state.toasts.shift();
      }
      toast.id = _.uniqueId('toast_');
      state.toasts.push(toast);
    },
    closeToast(state, toast: Toast) {
      const index = _.indexOf(state.toasts, toast);
      state.toasts.splice(index, 1);
    },
    setBoard(state, board: GameBoard) {
      state.board = board;
    },
    setCurrentState(state, step: GameStep) {
      state.currentState = step;
    },
    setCurrentUser(state, user: User) {
      state.currentUser = user;
    },
    setPlayers(state, players: User[]) {
      state.players = players;
    },
    setActivePlayer(state, player: User) {
      state.activePlayer = player;
    },
    setPlayersTurn(state, player: User) {
      state.playersTurn = player;
    },
    setActiveQuestion(state, question: Question) {
      state.activeQuestion = question;
    },
    setBuzzerTimer(state, timer: ITimer) {
      state.buzzerTimer = timer;
    },
    setJudge(state, judge: User) {
      state.judge = judge;
    },
    setAnswer(state, answer: string) {
      state.answer = answer;
    },
    SOCKET_role(state, role: Role) {
      state.role = role;
    },
  },
  actions: {
    SOCKET_room_error(state, message: string) {
      this.commit('pushToast', {
        status: 'error',
        message,
        title: 'Error from Game Room',
      });
    },
    SOCKET_question_answer(state, answer: string) {
      this.commit('setAnswer', answer);
    },
    SOCKET_sync(state, gameState: GameState) {
      console.log('game sync!');
      this.commit('setBoard', gameState.board);
      this.commit('setCurrentState', gameState.state);
      this.commit('setPlayers', gameState.players);
      this.commit('setActivePlayer', gameState.activePlayer);
      this.commit('setPlayersTurn', gameState.playersTurn);
      this.commit('setJudge', gameState.judge);
      this.commit('setActiveQuestion', gameState.activeQuestion);
      if (buzzerTimer) {
        buzzerTimer.stopTimer();
      }
      this.commit('setBuzzerTimer', gameState.buzzerTimer);
      // Start local timer and count down
      if (gameState.buzzerTimer) {
        buzzerTimer = new Timer(gameState.buzzerTimer.timeRemaining, 100);
        if (timerSub) {
          timerSub.unsubscribe();
        }
        timerSub = buzzerTimer.timer$.subscribe(
          (timeRemaining: number) => {
            this.commit('setBuzzerTimer', { timeRemaining, timeLimit: buzzerTimer.timeLimit });
          },
        );
        buzzerTimer.startTimer();
      }

    },
  },
};

export default new Vuex.Store(store);
