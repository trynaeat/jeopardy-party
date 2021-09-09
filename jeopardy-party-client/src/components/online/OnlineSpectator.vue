<template>
  <div class="flex-fluid">
    <div class="flex flex-center">
      <h1>Spectating</h1>
    </div>
    <template v-if="currentState === 'waitingForGame'">
      <span>Waiting for game...</span>
    </template>
    <template v-if="currentState === 'questionBoard' || currentState === 'awaitPlayers'">
      <GameBoard :clickable="false"></GameBoard>
      <AwaitingPlayers v-if="currentState === 'awaitPlayers'"></AwaitingPlayers>
    </template>
    <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer' || currentState === 'buzzersArmed'"></QuestionPrompt>
    <Answer v-if="currentState === 'showingAnswer'"></Answer>
    <BadAnswer v-if="currentState === 'showingBadResponse'"></BadAnswer>
    <RoundAdvance v-if="currentState === 'roundAdvance'"></RoundAdvance>
    <FinalJeopardy v-if="currentState === 'finalJeopardy' || currentState === 'judgingFinal'"></FinalJeopardy>
    <FinalAnswers v-if="currentState === 'showingFinalAnswer'"></FinalAnswers>
    <ShowWinner v-if="currentState === 'showingWinner'"></ShowWinner>
    <div class="flex flex-fluid flex-center half-margin-top">
        <Players></Players>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import GameBoard from '../GameBoard.vue';
import AwaitingPlayers from '../AwaitingPlayers.vue';
import QuestionPrompt from '../QuestionPrompt.vue';
import FinalJeopardy from '../FinalJeopardy.vue';
import FinalAnswers from '../FinalAnswers.vue';
import ShowWinner from '../ShowWinner.vue';
import Players from '../Players.vue';
import Answer from '../Answer.vue';
import BadAnswer from '../BadAnswer.vue';
import RoundAdvance from '../RoundAdvance.vue';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'OnlineSpectator',
  components: {
    GameBoard,
    FinalJeopardy,
    AwaitingPlayers,
    QuestionPrompt,
    FinalAnswers,
    ShowWinner,
    Players,
    Answer,
    BadAnswer,
    RoundAdvance,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
    }),
  }
});
</script>
