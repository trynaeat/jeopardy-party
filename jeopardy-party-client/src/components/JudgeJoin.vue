<template>
  <div>
    <form v-if="!judge" @submit.prevent="onSubmit()">
      <h3>Join Game as the Judge</h3>
      <label for="name">Username:</label>
      <input class="half-margin-left" id="name" v-model="username" placeholder="Enter a username...">
      <div>
        <button type="submit">Join!</button>
      </div>
    </form>
    <div v-if="judge">
        <h3>Judge is Taken!</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'JudgeJoin',
  computed: {
    ...mapState({
          judge: (state: any) => state.judge,
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
      this.$socket.emit('request_role', 'judge', this.username);
    },
  }
});
</script>
