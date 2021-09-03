<template>
  <div class="flex flex-column flex-fluid" style="align-items: center;">
      <div class="flex flex-fluid" style="align-items: center;">
          <div>
            <h1 v-if="winners.length > 1">Tie!</h1>
            <h1 v-else>Winner!</h1>
            <div class="flex flex-center">
                <h2 v-for="(player, i) in winners" :key="i" class="half-margin">{{ player.username }}</h2>
            </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { User } from '../interfaces';

export default Vue.extend({
  name: 'ShowWinner',
  computed: {
      ...mapState({
          role: (state: any) => state.role,
          // Get winners. May be multiple, in which case we announce a tie
          winners: (state: any) => (state.players as User[]).reduce((prev: User[], current) => {
              const newRes = [...prev];
              // @ts-ignore: Object is possibly 'null'
              if (!prev[0] || prev[0].winnings < current.winnings) {
                  return [current];
              } else if (prev[0].winnings === current.winnings) {
                  newRes.push(current);
                  return newRes;
              }

              return newRes;
          }, []),
          players: (state: any) => state.players,
      }),
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
</style>
