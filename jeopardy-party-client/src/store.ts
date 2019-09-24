import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { GameBoard, GameState, GameStep, Role, RootState, Round, Toast } from './interfaces';
import * as _ from 'lodash-es';

Vue.use(Vuex);

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
    SOCKET_sync(state, gameState: GameState) {
      console.log('game sync!');
      this.commit('setBoard', gameState.board);
      this.commit('setCurrentState', gameState.state);
    },
  },
};

export default new Vuex.Store(store);
