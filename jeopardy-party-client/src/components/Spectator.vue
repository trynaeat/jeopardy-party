<template>
  <div>
    <h1>Spectating</h1>
    <template v-if="currentState === 'waitingForGame'">
      <span>Waiting for game...</span>
    </template>
    <template v-if="currentState === 'questionBoard' || currentState === 'awaitPlayers'">
      <GameBoard :clickable="false"></GameBoard>
      <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    </template>
    <QuestionPrompt v-if="currentState === 'readQuestion'"></QuestionPrompt>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import AwaitingPlayers from './AwaitingPlayers.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Spectator',
  components: {
    GameBoard,
    AwaitingPlayers,
    QuestionPrompt,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
    }),
  }
});
</script>
