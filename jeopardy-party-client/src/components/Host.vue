<template>
  <div>
    <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    <GameBoard :clickable="true"></GameBoard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import AwaitingPlayers from './AwaitingPlayers.vue';

export default Vue.extend({
  name: 'Host',
  components: {
      AwaitingPlayers,
      GameBoard,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
      }),
  }
});
</script>
