<template>
  <div>
    <Host v-if="role === 'host'"></Host>
    <Spectator v-if="role === 'spectator'"></Spectator>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Vue from 'vue';
import Host from '@/components/Host.vue';
import Spectator from '@/components/Spectator.vue';

export default Vue.extend({
  name: 'PlayGame',
  components: {
    Host,
    Spectator,
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
    }),
  },
});
</script>
