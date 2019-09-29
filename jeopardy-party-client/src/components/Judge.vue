<template>
  <div>
    <h1>Judging</h1>
    <div class="timer">
      <Timer></Timer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Timer from './Timer.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Judge',
  components: {
    Timer,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
          username: (state: any) => state.currentUser.username,
          activePlayer: (state: any) => state.activePlayer,
    }),
  }
});
</script>
<style scoped lang="scss">
.timer {
  position: absolute;
  bottom: 0;
}
</style>
