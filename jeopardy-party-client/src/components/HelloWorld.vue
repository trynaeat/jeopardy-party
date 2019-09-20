<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Enter your code below to join a game</h3>
    <div class="half-margin-top">
      <input type="text" v-model="gameId"/>
      <button class="half-margin-left" @click="joinGame(gameId)">Join</button>
    </div>
    <h3>Want to host a new game? Click below</h3>
    <button class="half-margin-top">Create New Game</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data: function() {
    return {
      gameId: '',
    };
  },
  methods: {
    joinGame(gameId: String) {
      this.$store.commit('pushToast', {
        status: 'info',
        message: `Joining ${gameId}`,
        title: 'I\'m walkin\' here!',
      });
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
