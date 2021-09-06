<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <JoinGame msg="Welcome to Vue-Jeopardy!" :online="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import JoinGame from '@/components/JoinGame.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'online',
  components: {
    JoinGame,
  },
});
</script>
