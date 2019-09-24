<template>
  <div class="container-fluid">
    <div class="top-board row row--category">
        <div v-for="(cat, index) in categories" :key="index" class="col">
            <Card :text="cat" textSmall="true"></Card>
        </div>
    </div>
    <div class="main-board dbl-margin-top">
        <div class="row row--question" v-for="n in 5" :key="n">
            <div class="col" v-for="(cat, index) in categories" :key="index">
                <Card v-bind:text="board[cat][n - 1] && board[cat][n - 1].value"
                    v-bind:answered="board[cat][n - 1].answered"
                    v-bind:disabled="board[cat][n - 1].disabled"
                    v-bind:clickable="clickable"
                    textColor="yellow">
                </Card>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';
import Card from './Card.vue';

export default Vue.extend({
  name: 'GameBoard',
  props: {
    clickable: Boolean,
  },
  components: {
      Card,
  },
  computed: {
      ...mapState({
          board: (state: any) => _.get(state.board, state.round, { }),
          round: (state: any) => state.round,
          categories: (state: any) => _.keys(_.get(state.board, state.round, [])),
          gridClass: (state: any) => {
              const categories = _.keys(_.get(state.board, state.round, []));
              return categories ? `grid-${categories.length}-col` : '';
          }
      }),
  },
});
</script>

<style scoped lang="scss">
@import '../assets/variables.scss';
.row {
  padding: 5px;
  &--category .card {
    height: 13vh;
    padding-bottom: 0;
  }
  &--question .card {
    height: 13vh;
    padding-top: 13px;
  }
  &-container {
    @include shadow;
  }
}
.col {
    padding-left: 5px;
    padding-right: 5px;
}
.container-fluid {
    height: 100vh;
}
.main-board, .top-board {
    background: black;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
}
</style>
