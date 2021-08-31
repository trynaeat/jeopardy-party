<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <div class="flex flex-fluid" style="align-items: center;">
        <div>
            <h3>Answer: </h3>
            <p>{{ answer }}</p>
            <h3>Responses: </h3>
            <div class="flex flex-center" style="align-items: center;">
                <div v-for="(player, i) in players" :key="i" class="half-margin">
                    <h4>Username: {{ player.username }}</h4>
                    <h4>Response: {{ player.finalAnswer}}</h4>
                    <h4>Wager: {{ player.wager || 0 }}</h4>
                </div>
            </div>
            <div v-if="role === 'host'">
                <button v-on:click="onContinue()">Continue</button>
            </div>
        </div>
      </div>
      <Players></Players>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Players from './Players.vue';

export default Vue.extend({
  name: 'FinalAnswers',
  components: {
      Players,
  },
  computed: {
      ...mapState({
          answer: (state: any) => state.answer,
          players: (state: any) => state.players,
          role: (state: any) => state.role,
      }),
  },
  methods: {
      onContinue: function () {
          this.$socket.emit('hostAction', 'endGame');
      },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
p {
    font-size: 5vw;
    color: $yellow;
}
</style>
