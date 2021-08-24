<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <h2>Final Jeopardy!</h2>
      <GameClock></GameClock>
      <div class="flex flex-fluid" style="align-items: center;">
          <h1>{{ clue.question }}</h1>
      </div>
      <div v-if="role === 'player'" class="flex flex-center">
            <form style="width: 50vw" class="base-margin-top form-inline flex-center" @submit.prevent="onSubmit()" novalidate>
                <div class="form-group">
                    <input class="form-control" v-model="answer" placeholder="Enter your solution..." />
                    <button class="base-margin-left" type="submit" :disabled="submitted">Submit</button>
                </div>
            </form>
         </div>
      <Players v-if="role === 'host'"></Players>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash-es';
import { mapState } from 'vuex';
import { Round } from '../interfaces';
import Players from './Players.vue';
import GameClock from './GameClock.vue';

export default Vue.extend({
  name: 'FinalJeopardy',
  components: {
      GameClock,
      Players,
  },
  computed: {
      ...mapState({
          clue: (state: any) => state.board[Round.FINAL_JEOPARDY][_.keys(state.board[Round.FINAL_JEOPARDY])[0]][0],
          role: (state: any) => state.role,
      }),
  },
  data() {
      return {
          answer: '',
          submitted: false,
      };
  },
  methods: {
      onSubmit() {
          this.$socket.emit('answerFinal', this.answer);
          this.submitted = true;
      },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
