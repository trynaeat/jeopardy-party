<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <div class="flex flex-fluid" style="align-items: center;">
        <div>
            <h3>Incorrect Reponse: </h3>
            <p>{{ answer }}</p>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'BadAnswer',
  computed: {
      ...mapState({
          answer: (state: any) => state.activePlayer && state.activePlayer.lastAnswer,
      }),
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
p {
    font-size: 5vw;
    color: $yellow;
}
</style>
