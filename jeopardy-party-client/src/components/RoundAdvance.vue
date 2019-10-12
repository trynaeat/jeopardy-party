<template>
    <div class="flex flex-column flex-fluid" style="align-items: center;">
        <div class="flex flex-fluid" style="align-items: center;">
            <h1>Next Round: {{ round }}</h1>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameClock from './GameClock.vue';

export default Vue.extend({
  name: 'RoundAdvance',
  components: {
      GameClock,
  },
  computed: {
    ...mapState({
        gameTimer: (state: any) => state.gameTimer,
        round: (state: any) => state.round,
    }),
  },
});
</script>
