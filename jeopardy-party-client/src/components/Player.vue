<template>
  <div class="flex flex-column flex-fluid">
    <div class="flex-fluid">
      <div class="menu">
        <button type="button" class="btn btn-primary" data-toggle="modal" @click="showModal = true;">Edit Signature</button>
      </div>
      <h1>Player Name: {{ username }}</h1>
      <PlayerBuzzer v-if="currentState === 'readQuestion' || currentState === 'buzzersArmed'"></PlayerBuzzer>
      <h3 v-if="currentState === 'awaitPlayers'">Waiting on more players...</h3>
      <div v-if="currentState === 'questionBoard'">
          <h3 v-if="playersTurn.username === username">Pick a question!</h3>
          <h3 v-else>Waiting on {{ playersTurn.username }} to pick a question</h3>
      </div>
      <h3 v-if="currentState === 'playerAnswer'">Currently Answering: {{ activePlayer.username }}</h3>
      <h3 v-if="currentState === 'judgingAnswer'">Waiting on Judge...</h3>
      <Answer v-if="currentState === 'showingAnswer'"></Answer>
    </div>
    <div>
      <Timer></Timer>
    </div>
    <Modal :show.sync="showModal">
      <h5 slot="modal-header" class="modal-title">Sign your name (optional)</h5>
      <div slot="modal-body" class="text-center">
        <SignName ref="signName"></SignName>
      </div>
      <button slot="modal-footer" type="button" class="btn btn-primary" @click="saveSig()">Save</button>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from './common/Modal.vue';
import Answer from './Answer.vue';
import PlayerBuzzer from './PlayerBuzzer.vue';
import SignName from './SignName.vue';
import Timer from './Timer.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  components: {
    Answer,
    Modal,
    PlayerBuzzer,
    SignName,
    Timer,
  },
  computed: {
    ...mapState({
          currentState: (state: any) => state.currentState,
          username: (state: any) => state.currentUser.username,
          activePlayer: (state: any) => state.activePlayer,
          playersTurn: (state: any) => state.playersTurn,
    }),
  },
  data() {
    return {
      showModal: false,
    };
  },
  mounted() {
    this.showModal = true; // Prompt for signature when user first navigates
  },
  methods: {
    saveSig() {
      this.$refs.signName.submit();
      this.showModal = false;
    },
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.menu {
  position: fixed;
  top: 15px;
  right: 15px;
}
</style>
