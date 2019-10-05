<template>
  <div class="flex flex flex-column flex-fluid">
    <div class="flex flex-column flex-fluid">
      <h1>Judging</h1>
      <QuestionPrompt v-if="currentState === 'readQuestion' || currentState === 'playerAnswer' || currentState === 'judgingAnswer' || currentState === 'buzzersArmed'"></QuestionPrompt>
    </div>
    <div>
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
