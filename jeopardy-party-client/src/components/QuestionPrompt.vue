<template>
  <div class="main">
      <div class="flex-fluid">
          <div>
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
</style>
