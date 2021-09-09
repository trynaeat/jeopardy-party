<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
    <div class="flex flex-fluid" style="align-items: center;">
      <div>
        <h3>Space to Buzz In</h3>
        <h3 v-if="isOnline">Enter to Submit</h3>
        <BuzzerButton
          :height="buzzerWidth"
          :width="buzzerWidth"
          v-on:click="onBuzz()">
        </BuzzerButton>
        <div v-bind:class="{ 'hidden': !isOnline || !hasBuzzed || currentState === 'judgingAnswer' }" class="flex flex-fluid flex-center base-margin-top">
          <input ref="answer" type="text" style="width: 500px" v-model="answer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import BuzzerButton from './svg/buzzer/buzzerButton.vue';

export default Vue.extend({
  name: 'PlayerBuzzer',
  data: function() {
    return {
      answer: '',
    };
  },
  components: {
    BuzzerButton,
  },
  computed: {
    ...mapState({
      currentState: (state: any) => state.currentState,
      isOnline: (state: any) => state.isOnline,
      hasBuzzed: (state: any) => state.activePlayer && state.activePlayer.username === state.currentUser.username,
      buzzerWidth: (state: any) => state.isOnline ? '200px' : '300px',
    }),
  },
  watch: {
    hasBuzzed: function () {
      if (this.hasBuzzed) {
        (this.$refs.answer as any).focus();
      }
    },
  },
  mounted () {
     window.addEventListener('keydown', this.onKeydown);
  },
  methods: {
    onBuzz: function() {
      console.log('Clicked!');
      this.$socket.emit('playerAction', 'buzzIn');
    },
    onKeydown: function(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        this.$socket.emit('playerAction', 'answerQuestion', { answer: this.answer });
      }
    },
  },
  beforeDestroy () {
     window.removeEventListener('keydown', this.onKeydown);
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.hidden {
  opacity: 0;
}
</style>
