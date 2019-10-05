<template>
  <div class="flex flex-column flex-fluid">
    <div class="flex-fluid">
      <h1>Player Name: {{ username }}</h1>
      <PlayerBuzzer v-if="currentState === 'readQuestion' || currentState === 'buzzersArmed'"></PlayerBuzzer>
      <h3 v-if="currentState === 'awaitPlayers'">Waiting on more players...</h3>
      <div v-if="currentState === 'questionBoard'">
          <h3 v-if="playersTurn.username === username">Pick a question!</h3>
          <h3 v-else>Waiting on {{ playersTurn.username }} to pick a question</h3>
      </div>
      <h3 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer.username }}</h3>
      <h3 v-if="currentState === 'judgingAnswer'">Waiting on Judge...</h3>
      <Answer v-if="currentState === 'showingAnswer'"></Answer>
    </div>
    <div>
      <Timer></Timer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Answer from './Answer.vue';
import PlayerBuzzer from './PlayerBuzzer.vue';
import Timer from './Timer.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
    Answer,
    PlayerBuzzer,
    Timer,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
          username: (state: any) => state.currentUser.username,
          activePlayer: (state: any) => state.activePlayer,
          playersTurn: (state: any) => state.playersTurn,
    }),
  }
});
</script>
