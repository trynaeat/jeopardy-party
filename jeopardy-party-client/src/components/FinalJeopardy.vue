<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <h2>Final Jeopardy!</h2>
      <h2 v-if="currentState === 'judgingFinal'">Judging Responses...</h2>
      <div class="flex flex-fluid" style="align-items: center;" v-if="!(role === 'judge' && currentState === 'judgingFinal')">
          <div>
             <h1 v-html="clue.question"></h1>
             <div v-if="role === 'player'" class="flex flex-center">
                <form style="width: 50vw" class="base-margin-top form-inline flex-center" @submit.prevent="onSubmit()" novalidate>
                    <div class="form-group">
                        <input class="form-control" v-model="response" placeholder="Enter your solution..." />
                        <button class="base-margin-left" type="submit" :disabled="submitted">Submit</button>
                    </div>
                </form>
             </div>
          </div>
      </div>
      <div class="base-margin-top" v-if="role === 'judge' && currentState === 'judgingFinal'">
            <div><p class="answer">Answer: {{ answer }}</p></div>
            <h2>Select Correct Players Below:</h2>
            <SelectCard v-model="selectedPlayers" :key="playerHash">
                <SelectCardOption v-for="(player, i) in players"
                    :key="i"
                    v-bind:value="player">
                    <div>Player: {{ player.username }}</div>
                    <div>Response: {{ player.finalAnswer }}</div>
                </SelectCardOption>
            </SelectCard>
            <button v-on:click="onRuleFinal()">Submit</button>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash-es';
import { mapState } from 'vuex';
import { Round, User } from '../interfaces';
import SelectCard from './common/SelectCard.vue';
import SelectCardOption from './common/SelectCardOption.vue';

export default Vue.extend({
  name: 'FinalJeopardy',
  components: {
      SelectCard,
      SelectCardOption,
  },
  computed: {
      ...mapState({
          clue: (state: any) => state.board[Round.FINAL_JEOPARDY][_.keys(state.board[Round.FINAL_JEOPARDY])[0]][0],
          answer: (state: any) => state.answer,
          role: (state: any) => state.role,
          currentState: (state: any) => state.currentState,
          players: (state: any) => state.players,
          playerHash: (state: any) => state.players.map((p: User) => JSON.stringify(p)).join(''),
      }),
  },
  data() {
      return {
          response: '',
          submitted: false,
          selectedPlayers: [],
      };
  },
  methods: {
      onSubmit() {
          this.$socket.emit('playerAction', 'answerFinal', { answer: this.response });
          this.submitted = true;
      },
      onRuleFinal() {
          this.$socket.emit('judgeAction', 'ruleFinal', {
              correctPlayers: this.selectedPlayers.map((p: any) => p && p.username),
          });
      },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
