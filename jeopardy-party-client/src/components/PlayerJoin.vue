<template>
  <div>
    <form @submit.prevent="onSubmit()">
      <h3>Join Game as a Player</h3>
      <label for="name">Username:</label>
      <input class="half-margin-left" id="name" v-model="username" placeholder="Enter a username..." :disabled="players.length > 2">
      <div>
        <button type="submit" :disabled="players.length > 2">Join!</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'PlayerJoin',
  computed: {
    ...mapState({
          players: (state: any) => state.players,
    }),
  },
  data() {
    return {
      username: null,
    };
  },
  methods: {
    onSubmit() {
      const user = { username: this.username };
      this.$store.commit('setCurrentUser', user);
      this.$socket.emit('request_role', 'player', this.username);
    },
  }
});
</script>
