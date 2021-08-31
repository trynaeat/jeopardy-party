<template>
    <div id="countdown" class="game-timer">
      <div id="countdown-number">{{ (gameTimer.timeRemaining / 1000).toFixed() }}</div>
      <svg v-if="gameTimer">
        <circle r="18" cx="20" cy="20" v-bind:style="{ 'stroke-dashoffset': circleOffset }"></circle>
      </svg>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'GameClock',
  computed: {
    ...mapState({
        gameTimer: (state: any) => state.gameTimer,
        circleOffset: (state: any) => {
          const timer = state.gameTimer;
          if (!timer) {
            return 0;
          }

          return 113 - (timer.timeRemaining / timer.timeLimit) * 113;
        },
    }),
  },
});
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.game-timer {
  position: fixed;
  top: 55px;
  right: 55px;
  z-index: 9999 !important;
  text-align: center;
  height: 40px;
  width: 40px;
}

#countdown-number {
  color: white;
  display: inline-block;
  line-height: 40px;
}

svg {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  transform: rotateY(-180deg) rotateZ(-90deg);
}

svg circle {
  stroke-dasharray: 113px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 2px;
  stroke: white;
  fill: none;
  transition: stroke-dashoffset 0.1s;
}

</style>
