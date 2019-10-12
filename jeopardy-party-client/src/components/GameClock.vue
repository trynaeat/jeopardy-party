<template>
    <div>
        <div><span>Time Remaining:</span></div>
        <div><span>{{ gameTimer ? Math.floor(gameTimer.timeRemaining / 1000) : 0 }}</span></div>
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
    }),
  },
});
</script>
