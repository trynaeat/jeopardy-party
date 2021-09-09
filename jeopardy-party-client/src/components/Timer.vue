<template>
  <div class="flex">
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
  props: {
      playerName: String,
      playerOnly: Boolean, // Only show countdown for provided playerName
  },
  components: {
      TimerPiece,
  },
  computed: {
    ...mapState({
          buzzerTimer: (state: any) => state.buzzerTimer,
          activePlayer: (state: any) => state.activePlayer,
    }),
  },
  methods: {
      isActive(n: number) {
          if (!this.buzzerTimer) {
              return false;
          }
          if (this.playerOnly && (!this.activePlayer || this.activePlayer.username !== this.playerName)) {
              return false;
          }
          // 9 lamps counting down totalSeconds seconds and 5 total "pairs" of lamps including the middle
          const timeRemaining = this.buzzerTimer.timeRemaining;
          const totalSeconds = this.buzzerTimer.timeLimit / 1000;
          const minTime = Math.abs(totalSeconds - (n * totalSeconds / 5)) * 1000;
          return timeRemaining > minTime;
      },
  },
});
</script>

<style scoped lang="scss">
</style>