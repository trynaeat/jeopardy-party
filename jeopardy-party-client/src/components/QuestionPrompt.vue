<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <h2 v-if="currentState === 'judgingAnswer'">Judging Answer...</h2>
      <h2 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer.username }}</h2>
      <div class="flex flex-fluid" style="align-items: center;">
            <div>
                <p v-html="activeQuestion.question"></p>
                <div class="base-margin-top" v-if="role === 'judge'">
                    <div><p class="answer">Answer: {{ answer }}</p></div>
                    <div v-if="activePlayer">
                        <button @click="judgeAnswer(true)">Correct</button>
                        <button class="base-margin-left" @click="judgeAnswer(false)">Incorrect</button>
                    </div>
                    <div v-else>
                        <button v-if="currentState === 'readQuestion'" @click="armBuzzers()">Arm Buzzers</button>
                        <button v-if="currentState === 'buzzersArmed'" @click="skipQuestion()" class="base-margin-left" >Back to Board</button>
                    </div>
                </div>
            </div>
      </div>
      <Players v-if="role === 'host'"></Players>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Players from './Players.vue';

export default Vue.extend({
  name: 'QuestionPrompt',
  components: {
      Players,
  },
  computed: {
      ...mapState({
          activeQuestion: (state: any) => state.activeQuestion,
          answer: (state: any) => state.answer,
          activePlayer: (state: any) => state.activePlayer,
          currentState: (state: any) => state.currentState,
          role: (state: any) => state.role,
      }),
  },
  methods: {
      judgeAnswer(correct: boolean) {
          this.$socket.emit('answerRuling', this.activePlayer.username, this.activeQuestion.value, correct);
      },
      armBuzzers() {
          this.$socket.emit('armBuzzer');
      },
      skipQuestion() {
          this.$socket.emit('skipQuestion');
      },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
p {
    color: white;
    font-size: 5vw;
    align-self: center;
    top: 50%;
}
p.answer {
    color: $yellow;
}
</style>
