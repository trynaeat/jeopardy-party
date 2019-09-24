<template>
  <div>
    <h1>Player Name: {{ username }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as _ from 'lodash-es';

export default Vue.extend({
  name: 'Player',
  computed: {
    ...mapState({
          username: (state: any) => state.currentUser.username,
    }),
  }
});
</script>
