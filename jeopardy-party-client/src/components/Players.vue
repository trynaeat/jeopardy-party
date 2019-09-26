<template>
  <div class="main-content">
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[0]"></IconPlayerPodium>
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[1]"></IconPlayerPodium>
    <IconPodium :height="'190px'" :width="'150px'"></IconPodium>
    <IconPlayerPodium :height="'200px'" :width="'150px'" :player="players[2]"></IconPlayerPodium>
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
    }),
  }
});
</script>

<style scoped lang="scss">

</style>