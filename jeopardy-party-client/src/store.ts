import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState, Toast } from './interfaces';
import * as _ from 'lodash-es';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    toasts: [],
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
  },
  actions: {

  },
};

export default new Vuex.Store(store);
