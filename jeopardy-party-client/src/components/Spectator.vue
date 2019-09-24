<template>
  <div>
    <h1>Spectating</h1>
    <template v-if="currentState === 'waitingForGame'">
      <span>Waiting for game...</span>
    </template>
    <template v-if="currentState === 'awaitPlayers'">
      <span>Awaiting Players</span>
    </template>
    <template v-if="currentState === 'questionBoard'">
      <GameBoard :clickable="false"></GameBoard>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Spectator',
  components: {
    GameBoard,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
    }),
  }
});
</script>
