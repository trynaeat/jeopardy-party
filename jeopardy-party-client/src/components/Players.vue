<template>
  <div class="main-content flex">
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[0]" :active="players[0] && playersTurn.username === players[0].username"></IconPlayerPodium>
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[1]" :active="players[1] && playersTurn.username === players[1].username"></IconPlayerPodium>
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[2]" :active="players[2] && playersTurn.username === players[2].username"></IconPlayerPodium>
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';
import IconPodium from './svg/podium/IconPodium.vue';
import IconPlayerPodium from './svg/podium/IconPlayerPodium.vue';
import IconBase from './svg/IconBase.vue';

export default Vue.extend({
  name: 'Player',
  components: {
      IconBase,
      IconPodium,
      IconPlayerPodium,
  },
  computed: {
    ...mapState({
          players: (state: any) => state.players,
          playersTurn: (state: any) => state.playersTurn || { },
    }),
  }
});
</script>

<style scoped lang="scss">
</style>