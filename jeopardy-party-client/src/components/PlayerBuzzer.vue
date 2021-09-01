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

export default Vue.extend({
  name: 'PlayerBuzzer',
  components: {
    BuzzerButton,
  },
  methods: {
    onBuzz: function() {
      console.log('Clicked!');
      this.$socket.emit('playerAction', 'buzzIn');
    },
  }
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
