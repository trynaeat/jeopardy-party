<template>
  <div class="flex">
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

export default Vue.extend({
  name: 'PlayGame',
  components: {
    Host,
    Spectator,
    Player,
    Judge,
    Players,
    BoardLights,
  },
  mounted: function() {
    console.log('joining...');
    this.$socket.emit('game_join', this.$route.params.id);
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
    }),
  },
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
</style>
