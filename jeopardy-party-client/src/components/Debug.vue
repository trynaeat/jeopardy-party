<template>
    <div class="debug">
        <h3>Debug Menu</h3>
        <div id="advance">
            <button v-on:click="advanceRound">Advance Round</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Debug',
  methods: {
    advanceRound: function (event: Event) {
        this.$socket.emit('debug_advance_round');
    },
  }
});
</script>

<style scoped lang="scss">
div.debug {
    color: black;
    text-shadow: none;
    background: white;
    padding: 20px;
}
</style>