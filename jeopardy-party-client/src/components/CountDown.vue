<template>
  <div>
      <h3>Time Remaining: {{ buzzerTimer ? buzzerTimer.timeRemaining : 0 }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'CountDown',
  computed: {
    ...mapState({
          buzzerTimer: (state: any) => state.buzzerTimer,
    }),
  }
});
</script>
