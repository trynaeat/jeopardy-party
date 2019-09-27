<template>
  <div>
    <h1>Player Name: {{ username }}</h1>
    <QuestionPrompt v-if="currentState === 'readQuestion'"></QuestionPrompt>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QuestionPrompt from './QuestionPrompt.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
    QuestionPrompt,
  },
  computed: {
    ...mapState({
          username: (state: any) => state.currentUser.username,
    }),
  }
});
</script>
