<template>
  <div id="app">
    <Toast></Toast>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/online">Online</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './assets/variables.scss';
body {
  @include clue-font;
  background-color: $bg-color;
  color: white;
  text-shadow: 2px 2px 2px black;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 10px;
  text-align: center;
}
#nav {
  height: 3vh;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Toast from '@/components/common/Toast.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Toast,
  },
  sockets: {
    connect: function() {
      console.log('connected!');
      this.$store.commit('pushToast', {
        status: 'info',
        message: 'Connected to game server',
        title: 'Socket Connect',
        timeout: 3000,
      });
    },
    disconnect: function() {
      console.error('disconnected!');
      this.$store.commit('pushToast', {
        status: 'error',
        message: 'Your connection to the game server was disrupted',
        title: 'Socket Disconnect',
        timeout: 3000,
      });
    }
  },
});
</script>
