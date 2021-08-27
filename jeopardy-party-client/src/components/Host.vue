<template>
  <div class="flex flex-fluid">
    <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    <Answer v-if="currentState === 'showingAnswer'"></Answer>
    <GameBoard :clickable="true" v-if="currentState === 'questionBoard' || currentState === 'awaitPlayers'"></GameBoard>
    <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer' || currentState === 'buzzersArmed'"></QuestionPrompt>
    <RoundAdvance v-if="currentState === 'roundAdvance'"></RoundAdvance>
    <div v-if="currentState === 'finalWager'" class="flex flex-column flex-fluid" style="align-items: center;">
      <div class="flex flex-fluid" style="align-items: center;">
        <h1>Accepting Wagers...</h1>
      </div>
    </div>
    <FinalJeopardy v-if="currentState === 'finalJeopardy' || currentState === 'judgingFinal'"></FinalJeopardy>
    <FinalAnswers v-if="currentState === 'showingFinalAnswer'"></FinalAnswers>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from './GameBoard.vue';
import AwaitingPlayers from './AwaitingPlayers.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import Answer from './Answer.vue';
import RoundAdvance from './RoundAdvance.vue';
import FinalJeopardy from './FinalJeopardy.vue';
import FinalAnswers from './FinalAnswers.vue';

export default Vue.extend({
  name: 'Host',
  components: {
      Answer,
      AwaitingPlayers,
      GameBoard,
      QuestionPrompt,
      RoundAdvance,
      FinalJeopardy,
      FinalAnswers,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
      }),
  }
});
</script>
