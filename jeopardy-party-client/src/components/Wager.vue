<template>
    <div class="text-center">
        <h3>Place your Final Jeopardy wager!</h3>
        <GameClock></GameClock>
        <h3 class="base-margin-top">Category: {{ finalCategory }}</h3>
        <div class="flex flex-center">
            <form style="width: 50vw" class="base-margin-top form-inline flex-center" @submit.prevent="onSubmit()" novalidate>
                <div class="form-group">
                    <input class="form-control" :class="{ 'is-valid': valid, 'is-invalid': !valid && touched }" @input="validateWager()" v-model.number="wager" placeholder="Enter a wager..." />
                    <button class="base-margin-left" type="submit" :disabled="!valid || submitted">Submit</button>
                </div>
            </form>
         </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameClock from './GameClock.vue';
import { mapState } from 'vuex';
import { Round } from '../interfaces';
import { validateWager } from '../utils/Validators';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Wager',
  components: {
      GameClock,
  },
  computed: {
    ...mapState({
        finalCategory: (state: any) => _.keys(state.board[Round.FINAL_JEOPARDY])[0],
        currentUser: (state: any) => state.currentUser,
    }),
  },
  data() {
    return {
      wager: 0,
      valid: true,
      touched: false,
      submitted: false,
    };
  },
  methods: {
      onSubmit() {
        this.$socket.emit('playerAction', 'placeWager', { wager: this.wager });
        this.submitted = true;
      },
      validateWager() {
          this.touched = true;
          this.valid = validateWager(this.wager, this.currentUser.winnings);
      },
  },
});
</script>
