<template>
  <div>
    <h1>Judging</h1>
    <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer'"></QuestionPrompt>
    <div class="timer">
      <Timer></Timer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Timer from './Timer.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Judge',
  components: {
    QuestionPrompt,
    Timer,
  },
  computed: {
    ...mapState({
      currentState: (state: any) => state.currentState,
    }),
  },
});
</script>
<style scoped lang="scss">
.timer {
  position: absolute;
  bottom: 0;
}
</style>
