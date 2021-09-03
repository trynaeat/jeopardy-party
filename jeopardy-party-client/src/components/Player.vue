<template>
  <div class="flex flex-column flex-fluid">
    <div class="flex flex-column flex-fluid">
      <PlayerMenu></PlayerMenu>
      <h1>Player Name: {{ username }}</h1>
      <h3 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer ? activePlayer.username : '' }}</h3>
      <h3 v-if="currentState === 'judgingAnswer'">Waiting on Judge...</h3>
      <PlayerBuzzer v-if="currentState === 'readQuestion' || currentState === 'buzzersArmed' || currentState ==='judgingAnswer' || currentState === 'playerAnswer'"></PlayerBuzzer>
      <h3 v-if="currentState === 'awaitPlayers'">Waiting on more players...</h3>
      <div v-if="currentState === 'questionBoard'">
          <h3 v-if="playersTurn.username === username">Pick a question!</h3>
          <h3 v-else>Waiting on {{ playersTurn.username }} to pick a question</h3>
      </div>
      <Answer v-if="currentState === 'showingAnswer'"></Answer>
      <RoundAdvance v-if="currentState === 'roundAdvance'"></RoundAdvance>
      <Wager v-if="currentState === 'finalWager'"></Wager>
      <FinalJeopardy v-if="currentState === 'finalJeopardy' || currentState === 'judgingFinal'"></FinalJeopardy>
    </div>
    <div>
      <Timer></Timer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Answer from './Answer.vue';
import FinalJeopardy from './FinalJeopardy.vue';
import PlayerBuzzer from './PlayerBuzzer.vue';
import RoundAdvance from './RoundAdvance.vue';
import PlayerMenu from './PlayerMenu.vue';
import Timer from './Timer.vue';
import Wager from './Wager.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
    Answer,
    FinalJeopardy,
    PlayerBuzzer,
    PlayerMenu,
    RoundAdvance,
    Timer,
    Wager,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
          username: (state: any) => state.currentUser.username,
          activePlayer: (state: any) => state.activePlayer,
          playersTurn: (state: any) => state.playersTurn,
    }),
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
