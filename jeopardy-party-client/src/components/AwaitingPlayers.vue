<template>
    <div>
        <div class="overlay"></div>
        <div class="inner-content">
            <h2>Awaiting Players...</h2>
            <div class="panel" v-if="role === 'spectator'">
                <PlayerJoin></PlayerJoin>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import PlayerJoin from './PlayerJoin.vue';

export default Vue.extend({
  name: 'AwaitingPlayers',
  components: {
      PlayerJoin,
  },
  computed: {
      ...mapState({
          role: (state: any) => state.role,
      }),
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
}
.inner-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: 1.0;
    position: absolute;
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
