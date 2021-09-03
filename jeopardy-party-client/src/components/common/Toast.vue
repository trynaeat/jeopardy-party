<template>
    <div style="position: fixed; top: 10px; right: 10px; z-index: 999; width: 350px;">
        <transition-group name="toasts">
            <div v-for="toast in toasts" :key="toast.id">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <img class="rounded mr-2" src="favicon.ico" alt="...">
                    <strong class="mr-auto">{{ toast.title }}</strong>
                    <small class="text-muted">{{ toast.createdAt }}</small>
                    <button type="button"
                    class="ml-2 mb-1 close"
                    aria-label="Close"
                    @click="closeToast(toast)">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    {{ toast.message }}
                </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<style lang="scss">
.toast {
    opacity: 0.95;
    text-shadow: none;
    text-align: left;
    font-family: initial;
    color: #212529;
}

.toasts-enter-active, .toasts-leave-active {
  transition: all 0.3s;
}

.toasts-enter, .toasts-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Toast } from '../../interfaces';

export default Vue.extend({
  name: 'Toast',
  computed: {
      toasts() {
          return this.$store.state.toasts;
      }
  },
  methods: {
      closeToast(toast: Toast) {
          this.$store.commit('closeToast', toast);
      },
  }
});
</script>