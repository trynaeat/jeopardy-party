<template>
  <div class="flex flex-column flex-fluid">
    <div class="flex flex-column flex-fluid">
      <PlayerMenu></PlayerMenu>
      <h1>Player Name: {{ username }}</h1>
      <QuestionPrompt v-if="showBuzzer"></QuestionPrompt>
      <PlayerBuzzer v-if="showBuzzer"></PlayerBuzzer>
      <div v-if="currentState === 'awaitPlayers'">
          <h3>Waiting on more players...</h3>
          <div v-if="isPlayerOne">
            <button @click="startGame()" :disabled="players.length < 2">Start Game</button>
          </div>
      </div>
      <div v-if="currentState === 'questionBoard'">
          <h3 v-if="playersTurn.username === username">Pick a question!</h3>
          <h3 v-else>Waiting on {{ playersTurn.username }} to pick a question</h3>
      </div>
      <GameBoard :clickable="isMyTurn" v-if="currentState === 'questionBoard'"></GameBoard>
      <Answer v-if="currentState === 'showingAnswer'"></Answer>
      <BadAnswer v-if="currentState === 'showingBadResponse'"></BadAnswer>
      <RoundAdvance v-if="currentState === 'roundAdvance'"></RoundAdvance>
      <Wager v-if="currentState === 'finalWager'"></Wager>
      <FinalJeopardy v-if="currentState === 'finalJeopardy' || currentState === 'judgingFinal'"></FinalJeopardy>
      <FinalAnswers v-if="currentState === 'showingFinalAnswer'"></FinalAnswers>
      <ShowWinner v-if="currentState === 'showingWinner'"></ShowWinner>
      <div v-bind:class="{ 'hidden': showTimer }" class="flex flex-fluid flex-center half-margin-top">
        <Players></Players>
      </div>
    </div>
    <div v-if="showTimer">
      <Timer></Timer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Answer from '../Answer.vue';
import FinalJeopardy from '../FinalJeopardy.vue';
import PlayerBuzzer from '../PlayerBuzzer.vue';
import RoundAdvance from '../RoundAdvance.vue';
import PlayerMenu from '../PlayerMenu.vue';
import GameBoard from '../GameBoard.vue';
import QuestionPrompt from '../QuestionPrompt.vue';
import FinalAnswers from '../FinalAnswers.vue';
import ShowWinner from '../ShowWinner.vue';
import Timer from '../Timer.vue';
import Wager from '../Wager.vue';
import Players from '../Players.vue';
import BadAnswer from '../BadAnswer.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'OnlinePlayer',
  components: {
    Answer,
    BadAnswer,
    FinalJeopardy,
    PlayerBuzzer,
    Players,
    PlayerMenu,
    RoundAdvance,
    Timer,
    Wager,
    GameBoard,
    QuestionPrompt,
    FinalAnswers,
    ShowWinner,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
          username: (state: any) => state.currentUser.username,
          activePlayer: (state: any) => state.activePlayer,
          playersTurn: (state: any) => state.playersTurn,
          players: (state: any) => state.players,
          isPlayerOne: (state: any) => state.players && state.players[0] && state.players[0].username === state.currentUser.username,
          isMyTurn: (state: any) => state.playersTurn && state.playersTurn.username === state.currentUser.username,
          showBuzzer: (state: any) => state.currentState === 'playerAnswer' || state.currentState === 'readQuestion' || state.currentState === 'buzzersArmed' || state.currentState === 'judgingAnswer' && state.currentState !== 'showingBadResponse',
          showTimer: (state: any) => state.currentState === 'playerAnswer' && state.activePlayer && state.activePlayer.username === state.currentUser.username,
    }),
  },
  methods: {
      startGame () {
          this.$socket.emit('playerAction', 'startGame');
      },
  },
});
</script>

<style scoped lang="scss">
@import '../../assets/variables.scss';
.hidden {
    display: none !important;
}
</style>
