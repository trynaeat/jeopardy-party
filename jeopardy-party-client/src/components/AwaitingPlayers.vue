<template>
    <div>
        <div class="overlay"></div>
        <div class="inner-content">
            <h2 v-if="players.length < 3">Awaiting Players...</h2>
            <h2 v-else-if="!judge">Awaiting Judge...</h2>
            <h2 v-else>Awaiting Host...</h2>
            <div class="panel" v-if="role === 'spectator'">
                <PlayerJoin></PlayerJoin>
            </div>
            <div class="panel base-margin-top" v-if="role === 'spectator'">
                <JudgeJoin></JudgeJoin>
            </div>
            <div class="panel" v-if="role === 'host'">
                <button @click="startGame()" :disabled="players.length < 2 || !judge">Start Game</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import PlayerJoin from './PlayerJoin.vue';
import JudgeJoin from './JudgeJoin.vue';

export default Vue.extend({
  name: 'AwaitingPlayers',
  components: {
      PlayerJoin,
      JudgeJoin,
  },
  computed: {
      ...mapState({
          role: (state: any) => state.role,
          players: (state: any) => state.players,
          judge: (state: any) => state.judge,
      }),
  },
  methods: {
      startGame () {
          this.$socket.emit('startGame');
      },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.overlay {
    opacity: 0.7;
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 11;
    background-color: black;
    text-align: center;
    top: 0;
    left: 0;
}
.inner-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: 1.0;
    position: absolute;
    left: 0;
    top: 10vh;
    z-index: 12;
    width: 100vw;
    height: 100vh;
}
.panel {
    width: 30vw;
    background-color: $bg-color;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 5px 5px 30px #888888;
}
</style>
