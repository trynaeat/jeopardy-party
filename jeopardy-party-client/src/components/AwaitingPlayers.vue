<template>
    <Modal :show.sync="showModal" :closeButton="false">
        <div slot="modal-header">
            <h2 v-if="players.length < 3">Awaiting Players...</h2>
            <h2 v-else-if="!judge">Awaiting Judge...</h2>
            <h2 v-else>Awaiting Host...</h2>
        </div>
        <div slot="modal-body">
            <div v-if="role === 'spectator'">
                <PlayerJoin></PlayerJoin>
            </div>
            <div class="base-margin-top" v-if="role === 'spectator'">
                <JudgeJoin></JudgeJoin>
            </div>
            <div v-if="role === 'host'">
                <button @click="startGame()" :disabled="players.length < 2 || !judge">Start Game</button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import PlayerJoin from './PlayerJoin.vue';
import JudgeJoin from './JudgeJoin.vue';
import Modal from './common/Modal.vue';

export default Vue.extend({
  name: 'AwaitingPlayers',
  components: {
      PlayerJoin,
      JudgeJoin,
      Modal,
  },
  data() {
      return {
          showModal: true,
      };
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
</style>
