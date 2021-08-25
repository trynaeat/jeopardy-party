<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <h2>Correct Answer: {{ clue.answer }}</h2>
      <Players v-if="role === 'host'"></Players>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as _ from 'lodash-es';
import { mapState } from 'vuex';
import { Round } from '../interfaces';
import Players from './Players.vue';

export default Vue.extend({
  name: 'FinalJeopardy',
  components: {
      Players,
  },
  computed: {
      ...mapState({
          clue: (state: any) => state.board[Round.FINAL_JEOPARDY][_.keys(state.board[Round.FINAL_JEOPARDY])[0]][0],
          role: (state: any) => state.role,
      }),
  },
  data() {
  },
  methods: {
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
