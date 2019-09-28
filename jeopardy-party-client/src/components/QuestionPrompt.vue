<template>
  <div class="main">
      <h2 v-if="currentState === 'judgingAnswer'">Judging Answer...</h2>
      <h2 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer.username }}</h2>
      <div class="flex-fluid">
          <div class="flex-fluid inner">
            <p v-html="activeQuestion.question"></p>
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
          activePlayer: (state: any) => state.activePlayer,
          currentState: (state: any) => state.currentState,
          role: (state: any) => state.role,
      }),
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
div.main {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
div.flex-fluid {
    display: flex;
    align-items: center;
}
.inner {
    flex-direction: column;
}
</style>
