<template>
  <div>
    <h1>You're a host</h1>
    <GameBoard></GameBoard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameBoard from './GameBoard.vue';

export default Vue.extend({
  name: 'Host',
  components: {
      GameBoard,
  },
});
</script>
