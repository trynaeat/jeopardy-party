<template>
  <div class="flex">
    <div class="debug" v-if="debug">
      <Debug></Debug>
    </div>
    <div class="side-lights">
      <BoardLights :lit="armed"></BoardLights>
    </div>
    <div class="flex-fluid">
      <div class="flex main">
        <Host v-if="role === 'host'"></Host>
        <Spectator v-if="role === 'spectator'"></Spectator>
        <Player v-if="role === 'player'"></Player>
        <Judge v-if="role === 'judge'"></Judge>
      </div>
    </div>
    <div class="side-lights">
      <BoardLights :lit="armed"></BoardLights>
    </div>
    <GameClock v-if="gameTimer && gameTimer.timeRemaining > 0"></GameClock>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Vue from 'vue';
import Host from '@/components/Host.vue';
import Spectator from '@/components/Spectator.vue';
import Player from '@/components/Player.vue';
import Judge from '@/components/Judge.vue';
import Players from '@/components/Players.vue';
import BoardLights from '@/components/svg/boardLights/boardLights.vue';
import Debug from '@/components/Debug.vue';
import GameClock from '@/components/GameClock.vue';
import { Role } from '../interfaces';

export default Vue.extend({
  name: 'PlayGame',
  components: {
    Debug,
    Host,
    Spectator,
    Player,
    Judge,
    Players,
    BoardLights,
    GameClock,
  },
  mounted: function() {
    console.log('joining...');
    this.$socket.emit('game_join', this.$route.params.id);
    window.addEventListener('keypress', (event: KeyboardEvent) => {
      this.$store.dispatch('addKeyBuffer', event.key);
    });
  },
  methods: {
    onClick: function() {
      this.$socket.emit('playerAction', 'buzzIn');
    }
  },
  computed: {
    ...mapState({
        role: (state: any) => state.role,
        armed: (state: any) => state.currentState === 'buzzersArmed',
        gameTimer: (state: any) => state.gameTimer,
        debug: (state: any) => state.debug,
    }),
  },
  // Attempt to rejoin the game if we have a saved user id
  sockets: {
    role: function (data: { role: Role, uuid: string, username?: string }) {
      const savedUuid = localStorage.getItem(this.$route.params.id); // Get uuid if one is saved
      if (savedUuid && data.role === Role.SPECTATOR) {
        this.$socket.emit('rejoin', savedUuid);
      }
      if (data.role !== Role.SPECTATOR) {
        localStorage.setItem(this.$route.params.id, data.uuid);
      }
      if (data.role === Role.PLAYER) {
        const user = { username: data.username };
        this.$store.commit('setCurrentUser', user);
      }
    }
  }
});
</script>
<style lang="scss">
.side-lights {
  width: 5vw;
  height: 95vh;
}
.main {
  height: 95vh;
}
.debug {
  z-index: 9999;
  position: fixed;
}
</style>
