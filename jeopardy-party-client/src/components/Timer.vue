<template>
  <div class="flex timer">
    <div v-for="n in 9" :key="n">
        <TimerPiece :active="isActive(n)"></TimerPiece>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TimerPiece from './svg/timer/TimerPiece.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
      TimerPiece,
  },
  computed: {
    ...mapState({
          buzzerTimer: (state: any) => state.buzzerTimer,
    }),
  },
  methods: {
      isActive(n: number) {
          if (!this.buzzerTimer) {
              return false;
          }
          // 9 lamps counting down 5 seconds - so a pair goes down every second, with the middle 1 as the last second
          const timeRemaining = this.buzzerTimer.timeRemaining;
          const minTime = Math.abs(5 - n) * 1000;
          return timeRemaining > minTime;
      },
  },
});
</script>

<style scoped lang="scss">
.timer {
    position: absolute;
    bottom: 0;
}
</style>