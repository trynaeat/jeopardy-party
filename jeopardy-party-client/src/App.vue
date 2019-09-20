<template>
  <div class="app-main" id="app">
    <Toast></Toast>
    <div id="nav">
      <router-link to="/">Home</router-link> |
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
</style>

<script lang="ts">
import Vue from 'vue';
import Toast from '@/components/Toast.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Toast,
  },
});
</script>
