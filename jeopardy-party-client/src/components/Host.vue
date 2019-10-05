<template>
  <div class="flex flex-fluid">
    <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    <Answer v-if="currentState === 'showingAnswer'"></Answer>
    <GameBoard :clickable="true" v-if="currentState === 'questionBoard' || currentState === 'awaitPlayers'"></GameBoard>
    <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer' || currentState === 'buzzersArmed'"></QuestionPrompt>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import AwaitingPlayers from './AwaitingPlayers.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import Answer from './Answer.vue';

export default Vue.extend({
  name: 'Host',
  components: {
      Answer,
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
