import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { GameBoard, GameState, GameStep, Question, Role, RootState, Round, ITimer, Toast, User } from './interfaces';
import { Timer } from './utils/Timer';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FinalAnswerEvent } from './interfaces/User';

Vue.use(Vuex);

const superSecretDebugKey = 'mikerichardssucks';
const buzzerSync$ = new Subject();
const gameTimerSync$ = new Subject();
let buzzerTimer: Timer;
let gameTimer: Timer;

/**
 * Note anything with the STORE_ prefix gets called automagically by vue-socket.io
 * when a matching event arrives.
 */
const store: StoreOptions<RootState> = {
  state: {
    debug: false,
    keyBuffer: [],
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
    gameTimer: undefined,
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
      // If the toast has a timeout, schedule to remove it
      if (toast.timeout) {
        setTimeout(() => {
          state.toasts = _.without(state.toasts, toast);
        }, toast.timeout);
      }
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
      // Keep any signatures around so they aren't erased
      players = players.map((p) => {
        const found = _.find(state.players, (oldP) => oldP.username === p.username);
        if (found) {
          p.signature = found.signature;
        }
        return p;
      });
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
    setGameTimer(state, timer: ITimer) {
      state.gameTimer = timer;
    },
    setJudge(state, judge: User) {
      state.judge = judge;
    },
    setAnswer(state, answer: string) {
      state.answer = answer;
    },
    setRound(state, round: Round) {
      state.round = round;
    },
    setDebug(state, debug: boolean) {
      state.debug = debug;
    },
    setKeyBuffer(state, buffer: string[]) {
      state.keyBuffer = buffer;
    },
    SOCKET_updatePlayer(state, player: User) {
      const idx = _.findIndex(state.players, p => p.username === player.username);
      if (idx !== -1) {
        state.players[idx] = player;
      }
      state.players = _.cloneDeep(state.players); // Change detect
    },
    SOCKET_role(state, role: Role) {
      state.role = role;
    },
  },
  actions: {
    addKeyBuffer({ commit, dispatch, state }, key: string) {
      // Do nothing if debug already enabled
      if (state.debug) {
        return;
      }

      commit('setKeyBuffer', [...state.keyBuffer, key]);
      const len = state.keyBuffer.length;
      if (superSecretDebugKey[len - 1] !== key) {
        dispatch('clearKeyBuffer');
      } else if (len === superSecretDebugKey.length) {
        commit('setDebug', true);
        dispatch('clearKeyBuffer');
      }
    },
    clearKeyBuffer({ commit }) {
      commit('setKeyBuffer', []);
    },
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
    SOCKET_final_answer({ commit, state }, answer: FinalAnswerEvent[]) {
      const newPlayers = state.players.map(p => {
        const found = answer.find(e => e.username === p.username);
        p.wager = found && found.wager;
        p.finalAnswer = found && found.finalAnswer;
        return p;
      });

      commit('setPlayers', newPlayers);
    },
    SOCKET_sync(state, gameState: GameState) {
      console.log('game sync!');
      this.commit('setBoard', gameState.board);
      this.commit('setCurrentState', gameState.state);
      this.commit('setPlayers', gameState.players);
      // If there's a current user, update them as well
      if (state.state.currentUser && _.find(gameState.players, (p) => p.username === _.get(state.state.currentUser, 'username'))) {
        this.commit('setCurrentUser', _.find(gameState.players, (p) => p.username === _.get(state.state.currentUser, 'username')));
      }
      this.commit('setActivePlayer', gameState.activePlayer);
      this.commit('setPlayersTurn', gameState.playersTurn);
      this.commit('setJudge', gameState.judge);
      this.commit('setActiveQuestion', gameState.activeQuestion);
      this.commit('setRound', gameState.round);
      if (buzzerTimer) {
        buzzerTimer.stopTimer();
      }
      if (gameTimer) {
        gameTimer.stopTimer();
      }
      this.commit('setBuzzerTimer', gameState.buzzerTimer);
      // Start local buzzer timer and count down
      if (gameState.buzzerTimer) {
        buzzerTimer = new Timer(gameState.buzzerTimer.timeRemaining, 100);
        buzzerSync$.next();
        buzzerTimer.timer$.pipe(
          takeUntil(buzzerSync$),
        )
        .subscribe(
          (timeRemaining: number) => {
            this.commit('setBuzzerTimer', { timeRemaining, timeLimit: buzzerTimer.timeLimit });
          },
        );
        buzzerTimer.startTimer();
      }
      // Same for general game timer
      if (gameState.gameTimer) {
        gameTimer = new Timer(gameState.gameTimer.timeRemaining, 100);
        gameTimerSync$.next();
        gameTimer.timer$.pipe(
          takeUntil(gameTimerSync$),
        )
        .subscribe((timeRemaining: number) => {
          this.commit('setGameTimer', { timeRemaining, timeLimit: gameTimer.timeLimit });
        });
        gameTimer.startTimer();
      }

    },
  },
};

export default new Vuex.Store(store);
