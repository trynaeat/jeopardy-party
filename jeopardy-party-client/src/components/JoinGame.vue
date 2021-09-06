<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 v-if="online">Online Game Mode</h2>
    <h3>Enter your code below to join a game</h3>
    <div class="half-margin-top">
      <input type="text" v-model="gameId"/>
      <button class="half-margin-left" @click="joinGame(gameId)">Join</button>
    </div>
    <h3>Want to host a new game? Click below</h3>
    <button class="half-margin-top" @click="createGame()">Create New Game</button>
    <template v-if="createdGameId">
      <h4 class="half-margin-top">Your Game ID is {{ createdGameId }}</h4>
      <p>Give this code to your friends you would like to join</p>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'JoinGame',
  props: {
    msg: String,
    online: Boolean,
  },
  data: function() {
    return {
      gameId: '',
      createdGameId: null,
    };
  },
  methods: {
    joinGame(gameId: String) {
      this.axios.get(`/game/${gameId}`)
        .then(response => {
          this.$router.push(`/play/${gameId}`);
        })
        .catch(err => {
          this.$store.commit('pushToast', {
            status: 'error',
            message: 'Error: Could not find a game with the provided ID',
            title: 'Error Joining Game',
          });
        });
    },
    createGame() {
      this.axios.post('/game', { online: this.online })
        .then(response => {
          this.createdGameId = response.data.roomId;
        })
        .catch(err => {
          this.$store.commit('pushToast', {
            status: 'error',
            message: 'Error creating game instance. Please try again.',
            title: 'Error: Game Create',
          });
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
