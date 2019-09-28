<template>
  <div>
    <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    <GameBoard :clickable="true" v-if="currentState === 'questionBoard' || currentState === 'awaitPlayers'"></GameBoard>
    <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer'"></QuestionPrompt>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import AwaitingPlayers from './AwaitingPlayers.vue';
import QuestionPrompt from './QuestionPrompt.vue';

export default Vue.extend({
  name: 'Host',
  components: {
      AwaitingPlayers,
      GameBoard,
      QuestionPrompt,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
      }),
  }
});
</script>
