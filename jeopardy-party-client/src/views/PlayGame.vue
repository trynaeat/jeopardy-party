<template>
  <h1>Play Game!</h1>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PlayGame',
  mounted: function() {
    console.log('joining...');
    this.$socket.emit('game_join', this.$route.params.id);
  },
});
</script>
