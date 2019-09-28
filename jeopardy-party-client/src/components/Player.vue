<template>
  <div>
    <h1>Player Name: {{ username }}</h1>
    <PlayerBuzzer v-if="currentState === 'readQuestion'"></PlayerBuzzer>
    <h3 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer.username }}</h3>
    <h3 v-if="currentState === 'judgingAnswer'">Waiting on Judge...</h3>
    <CountDown></CountDown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayerBuzzer from './PlayerBuzzer.vue';
import CountDown from './CountDown.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
    CountDown,
    PlayerBuzzer,
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
