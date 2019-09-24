<template>
  <div class="main-content">
    <span>Players</span>
    <IconPodium></IconPodium>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';
import IconPodium from './svg/podium/IconPodium.vue';
import IconBase from './svg/IconBase.vue';

export default Vue.extend({
  name: 'Player',
  components: {
      IconBase,
      IconPodium,
  },
  computed: {
    ...mapState({
          players: (state: any) => state.players,
    }),
  }
});
</script>

<style scoped lang="scss">
.main-content {
}
</style>