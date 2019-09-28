<template>
    <div>
        <h3>Enter to Buzz In</h3>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'PlayerBuzzer',
  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        console.log('Enter hit!');
        this.$socket.emit('playerAction', 'buzzIn');
      }
    });
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
