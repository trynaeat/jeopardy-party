<template>
  <div class="flex flex flex-column flex-fluid">
    <div class="flex flex-column flex-fluid">
      <h1>Judging</h1>
      <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer' || currentState === 'buzzersArmed'"></QuestionPrompt>
      <Answer v-if="currentState === 'showingAnswer'"></Answer>
      <RoundAdvance v-if="currentState === 'roundAdvance'"></RoundAdvance>
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
import Timer from './Timer.vue';
import FinalJeopardy from './FinalJeopardy.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import RoundAdvance from './RoundAdvance.vue';

import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Judge',
  components: {
    Answer,
    FinalJeopardy,
    QuestionPrompt,
    RoundAdvance,
    Timer,
  },
  computed: {
    ...mapState({
      currentState: (state: any) => state.currentState,
    }),
  },
});
</script>
