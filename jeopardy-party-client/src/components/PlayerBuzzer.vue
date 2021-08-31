<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
    <div class="flex flex-fluid" style="align-items: center;">
      <div>
        <h3>Enter to Buzz In</h3>
        <BuzzerButton
          :height="'300px'"
          :width="'300px'"
          v-on:click="onBuzz()">
        </BuzzerButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BuzzerButton from './svg/buzzer/buzzerButton.vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'PlayerBuzzer',
  components: {
    BuzzerButton,
  },
  created() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onBuzz: function() {
      console.log('Clicked!');
      this.$socket.emit('playerAction', 'buzzIn');
    },
    onKeydown: function (e: KeyboardEvent) {
      if (e.key == 'Enter') {
        console.log('Enter hit!');
        this.$socket.emit('playerAction', 'buzzIn');
      }
    },
  }
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
