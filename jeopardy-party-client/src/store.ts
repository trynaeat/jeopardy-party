import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { GameBoard, GameState, Role, RootState, Round, Toast } from './interfaces';
import * as _ from 'lodash-es';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    toasts: [],
    role: Role.SPECTATOR,
    board: null,
    round: Round.JEOPARDY,
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
      _.remove(state.toasts, (o: Toast) => o === toast);
      state.toasts = _.clone(state.toasts); // trigger change detection
    },
    setBoard(state, board: GameBoard) {
      state.board = board;
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
    },
  },
};

export default new Vuex.Store(store);
